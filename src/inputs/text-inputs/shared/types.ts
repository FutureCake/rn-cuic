import type { TokenValue } from '../../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../button/types';

export type FeedbackVariant = 'info' | 'warning' | 'error';

export type Feedback<Variant extends string = FeedbackVariant> = {
    message: string;
    /** Falls back to the configured default variant. */
    variant?: Variant;
};

export type ValidationResult<Variant extends string = FeedbackVariant> = {
    valid: boolean;
    /** Feedback variant while invalid; falls back to the feedback's variant. */
    variant?: Variant;
    message?: string;
};

export type Validation<Variant extends string = FeedbackVariant> = {
    validator: (text: string) => ValidationResult<Variant>;
    onValidation?: (result: ValidationResult<Variant>) => void;
    /** When invalid validation feedback replaces the default feedback. */
    showFeedbackOn: 'change' | 'blur';
};

/** Declaration order matters: disabled is declared last so it wins. */
export type FieldStates = 'focused' | 'disabled';

export type FieldInfluences<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = { feedbackVariant: Variant; theme: Theme };

/** One value map; callbacks receive the other influences, never their own. */
export type InfluenceValueMap<
    Tokens extends object,
    Values extends string,
    OwnKey extends keyof FieldInfluences,
    Variant extends string,
    Theme extends string,
> = {
    [Value in Values]: TokenValue<
        Tokens,
        Omit<FieldInfluences<Variant, Theme>, OwnKey>
    >;
};
