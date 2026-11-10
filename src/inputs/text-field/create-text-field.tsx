import { useState } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ResolvedComponentResult } from '../../providers-and-hooks';
import { createSlotContext } from '../../utils/create-slot-context';
import { hasSlot } from '../../utils/has-slot';
import type {
    TextFieldBuilderOptions,
    TextFieldFeedbackProps,
    TextFieldHeaderProps,
    TextFieldInputProps,
    TextFieldProps,
    TextFieldStyleDefinition,
    ValidationResult,
} from './types';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

/** Fixed TextField tokens/slots: parts can share the default-generic contract. */
type TextFieldContextValue =
    ResolvedComponentResult<TextFieldStyleDefinition> & {
        /** Root-owned native input props, including the wrapped handlers. */
        inputProps: TextInputProps;
        /** Active (invalid, visible) validation message, if any. */
        validationMessage: string | undefined;
        message: string | undefined;
        variant: string;
    };

/**
 * Bind shared behavior and stable compound parts once, at factory creation.
 * Each configured TextField family owns its parts and their nearest-root context.
 */
export function createTextField<Variant extends string, Theme extends string>({
    defaults,
    useStyles,
    useTheme,
}: TextFieldBuilderOptions<Variant, Theme>) {
    const { ContextProvider, useSlotContext } =
        createSlotContext<TextFieldContextValue>('TextField');

    function TextFieldHeader({ style, ...props }: TextFieldHeaderProps) {
        const { styles } = useSlotContext('TextField.Header');
        return <Animated.Text {...props} style={[styles.header, style]} />;
    }

    function TextFieldInput({ style }: TextFieldInputProps) {
        const { styles, inputProps } = useSlotContext('TextField.Input');
        return (
            <AnimatedTextInput {...inputProps} style={[styles.input, style]} />
        );
    }

    function TextFieldFeedback({
        children,
        style,
        ...props
    }: TextFieldFeedbackProps) {
        const { styles, tokens, validationMessage, message, variant } =
            useSlotContext('TextField.Feedback');

        if (typeof children === 'function') {
            return (
                <>
                    {children({
                        message,
                        variant,
                        tokens,
                        style: [styles.feedback, style],
                    })}
                </>
            );
        }

        const content = validationMessage ?? children ?? message;
        if (content === undefined || content === null || content === '') {
            return null;
        }
        return (
            <Animated.Text {...props} style={[styles.feedback, style]}>
                {content}
            </Animated.Text>
        );
    }

    function TextFieldRoot({
        theme: themeProp,
        disabled = false,
        header,
        feedback,
        feedbackVariant = defaults.feedbackVariant,
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
        const variant = activeValidation?.variant ?? feedbackVariant;
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
                    message: validationMessage ?? feedback,
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
                        <TextFieldFeedback>{feedback}</TextFieldFeedback>
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
