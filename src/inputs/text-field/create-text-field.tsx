import { useState } from 'react';
import Animated from 'react-native-reanimated';
import { hasSlot } from '../../utils/has-slot';
import { ContextProvider } from './context';
import { TextFieldFeedback } from './slots/feedback';
import { TextFieldHeader } from './slots/header';
import { TextFieldInput } from './slots/input';
import type {
    TextFieldBuilderOptions,
    TextFieldProps,
    ValidationResult,
} from './types';

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
        const [focused, setFocused] = useState(false);
        const [hasBlurred, setHasBlurred] = useState(false);
        const [validationResult, setValidationResult] = useState<
            ValidationResult<Variant> | undefined
        >(undefined);

        const activeValidation =
            validation !== undefined &&
            validationResult !== undefined &&
            !validationResult.valid &&
            (validation.showFeedbackOn === 'change' || hasBlurred)
                ? validationResult
                : undefined;
        const feedbackProp =
            typeof feedback === 'string' ? { message: feedback } : feedback;
        const variant =
            activeValidation?.variant ??
            feedbackProp?.variant ??
            defaults.feedbackVariant;
        const validationMessage = activeValidation?.message;

        const { styles, tokens } = useStyles({
            influences: { feedbackVariant: variant, theme },
            states: { focused: focused && !disabled, disabled },
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
                        onChangeText: (text) => {
                            onChangeText?.(text);
                            if (!validation) return;
                            const result = validation.validator(text);
                            setValidationResult(result);
                            validation.onValidation?.(result);
                        },
                        onFocus: (event) => {
                            setFocused(true);
                            onFocus?.(event);
                        },
                        onBlur: (event) => {
                            setFocused(false);
                            setHasBlurred(true);
                            onBlur?.(event);
                        },
                    },
                    validationMessage,
                    message: validationMessage ?? feedbackProp?.message,
                    variant,
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
                            {feedbackProp?.message}
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
