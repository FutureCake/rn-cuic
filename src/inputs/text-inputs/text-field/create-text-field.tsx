import Animated from 'react-native-reanimated';
import { hasSlot } from '../../../utils/has-slot';
import { useFieldBehavior } from '../shared/use-field-behavior';
import { ContextProvider } from './context';
import { TextFieldFeedback } from './slots/feedback';
import { TextFieldHeader } from './slots/header';
import { TextFieldInput } from './slots/input';
import type { TextFieldBuilderOptions, TextFieldProps } from './types';

/**
 * Bind shared behavior to the configured defaults and style hooks; the slot
 * parts are shared and resolve the nearest TextField root's context.
 */
export function createTextField<Variant extends string, Theme extends string>({
    defaults,
    useStyles,
    useTheme,
}: TextFieldBuilderOptions<Variant, Theme>) {
    function TextFieldRoot({
        theme: themeProp,
        disabled = false,
        header,
        feedback,
        validation,
        style,
        styleOverrides,
        accessibilityState,
        children,
        onChangeText,
        onFocus,
        onBlur,
        ...props
    }: TextFieldProps<Variant, Theme>) {
        const { theme: ambientTheme } = useTheme();
        const theme = themeProp ?? ambientTheme;
        const field = useFieldBehavior({
            feedback,
            validation,
            defaultVariant: defaults.feedbackVariant,
            onChangeText,
            onFocus,
            onBlur,
        });

        const { styles, tokens } = useStyles({
            influences: { feedbackVariant: field.variant, theme },
            states: { focused: field.focused && !disabled, disabled },
            overrides: {
                ...styleOverrides,
                container: [styleOverrides?.container, style],
            },
        });

        return (
            <ContextProvider
                value={{
                    styles,
                    tokens,
                    inputProps: {
                        ...props,
                        editable: !disabled,
                        accessibilityState: { ...accessibilityState, disabled },
                        placeholderTextColor: tokens.placeholderColor,
                        ...field.handlers,
                    },
                    validationMessage: field.validationMessage,
                    message: field.message,
                    variant: field.variant,
                }}
            >
                <Animated.View style={styles.container}>
                    {header !== undefined &&
                        !hasSlot(children, TextFieldHeader) && (
                            <TextFieldHeader>{header}</TextFieldHeader>
                        )}
                    {children}
                    {!hasSlot(children, TextFieldInput) && <TextFieldInput />}
                    {!hasSlot(children, TextFieldFeedback) && (
                        <TextFieldFeedback>
                            {field.feedbackMessage}
                        </TextFieldFeedback>
                    )}
                </Animated.View>
            </ContextProvider>
        );
    }

    return Object.assign(TextFieldRoot, {
        Header: TextFieldHeader,
        Input: TextFieldInput,
        Feedback: TextFieldFeedback,
    });
}
