import { useState } from 'react';
import type { ColorValue, TextInputProps } from 'react-native';
import { useValidationFeedback } from '../../../shared/hooks/use-validation-feedback';
import type { Feedback, Validation } from './types';

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
    const { runValidation, ...feedbackState } = useValidationFeedback<
        string,
        Variant
    >({
        feedback,
        validation,
        defaultVariant,
        showInvalid: validation?.showFeedbackOn === 'change' || hasBlurred,
    });

    return {
        focused,
        ...feedbackState,
        handlers: {
            onChangeText: (text: string) => {
                onChangeText?.(text);
                runValidation(text);
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

/** Assemble the root-owned native input props handed to the Input slot. */
export function buildFieldInputProps({
    props,
    disabled,
    accessibilityState,
    placeholderColor,
    handlers,
}: {
    /** Remaining native input props from the root's rest parameter. */
    props: TextInputProps;
    disabled: boolean;
    accessibilityState: TextInputProps['accessibilityState'];
    placeholderColor: ColorValue;
    handlers: Pick<TextInputProps, 'onChangeText' | 'onFocus' | 'onBlur'>;
}): TextInputProps {
    return {
        ...props,
        editable: !disabled,
        accessibilityState: { ...accessibilityState, disabled },
        placeholderTextColor: placeholderColor,
        ...handlers,
    };
}
