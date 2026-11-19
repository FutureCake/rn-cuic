import { useState } from 'react';
import type { Feedback, ValidationResult } from '../types';

/** The minimal validation contract; components add their own gating props. */
type ValidationLike<Input, Variant extends string> = {
    validator: (input: Input) => ValidationResult<Variant>;
    onValidation?: (result: ValidationResult<Variant>) => void;
};

/**
 * Shared validation + feedback resolution: holds the last validation result
 * and resolves the active variant/message; an invalid result replaces the
 * feedback prop's message while it is surfaced.
 */
export function useValidationFeedback<Input, Variant extends string>({
    feedback,
    validation,
    defaultVariant,
    showInvalid = true,
}: {
    feedback: string | Feedback<Variant> | undefined;
    validation: ValidationLike<Input, Variant> | undefined;
    defaultVariant: Variant;
    /** Gate for surfacing an invalid result (e.g. only after blur). */
    showInvalid?: boolean;
}) {
    const [validationResult, setValidationResult] = useState<
        ValidationResult<Variant> | undefined
    >(undefined);

    const activeValidation =
        validation !== undefined &&
        validationResult !== undefined &&
        !validationResult.valid &&
        showInvalid
            ? validationResult
            : undefined;
    const feedbackProp =
        typeof feedback === 'string' ? { message: feedback } : feedback;
    const validationMessage = activeValidation?.message;

    return {
        variant:
            activeValidation?.variant ??
            feedbackProp?.variant ??
            defaultVariant,
        /** Active (invalid, visible) validation message, if any. */
        validationMessage,
        /** Validation message, else the feedback prop's message. */
        message: validationMessage ?? feedbackProp?.message,
        /** The feedback prop's message, for the shorthand Feedback child. */
        feedbackMessage: feedbackProp?.message,
        /** Validate the input and store/report the result. */
        runValidation: (input: Input) => {
            if (validation === undefined) return;
            const result = validation.validator(input);
            setValidationResult(result);
            validation.onValidation?.(result);
        },
    };
}
