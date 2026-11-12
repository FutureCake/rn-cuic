import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import type { Feedback, Validation, ValidationResult } from './types';

type FieldBehaviorOptions<Variant extends string> = {
    feedback: string | Feedback<Variant> | undefined;
    validation: Validation<Variant> | undefined;
    defaultVariant: Variant;
    onChangeText: TextInputProps['onChangeText'];
    onFocus: TextInputProps['onFocus'];
    onBlur: TextInputProps['onBlur'];
};

/**
 * Shared field behavior: focus tracking, validation state and feedback
 * resolution, plus the wrapped native handlers for the root's input props.
 */
export function useFieldBehavior<Variant extends string>({
    feedback,
    validation,
    defaultVariant,
    onChangeText,
    onFocus,
    onBlur,
}: FieldBehaviorOptions<Variant>) {
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
        activeValidation?.variant ?? feedbackProp?.variant ?? defaultVariant;
    const validationMessage = activeValidation?.message;

    return {
        focused,
        variant,
        /** Active (invalid, visible) validation message, if any. */
        validationMessage,
        /** Validation message, else the feedback prop's message. */
        message: validationMessage ?? feedbackProp?.message,
        /** The feedback prop's message, for the shorthand Feedback child. */
        feedbackMessage: feedbackProp?.message,
        handlers: {
            onChangeText: (text: string) => {
                onChangeText?.(text);
                if (!validation) return;
                const result = validation.validator(text);
                setValidationResult(result);
                validation.onValidation?.(result);
            },
            onFocus: ((event) => {
                setFocused(true);
                onFocus?.(event);
            }) satisfies TextInputProps['onFocus'],
            onBlur: ((event) => {
                setFocused(false);
                setHasBlurred(true);
                onBlur?.(event);
            }) satisfies TextInputProps['onBlur'],
        },
    };
}
