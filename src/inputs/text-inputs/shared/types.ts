import type { ReactNode } from 'react';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
} from '../../../providers-and-hooks';
import type { TokenValue } from '../../../providers-and-hooks/styles-manager/types';
import type { StyleOverrides, ThemeMode } from '../../../utils/types';

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

/** Both influence maps; supported names are inferred from the map keys. */
export type FieldInfluenceResolvers<
    Tokens extends object,
    Variant extends string,
    Theme extends string,
> = {
    theme: InfluenceValueMap<
        Tokens,
        Theme,
        'theme',
        NoInfer<Variant>,
        NoInfer<Theme>
    >;
    feedbackVariant: InfluenceValueMap<
        Tokens,
        Variant,
        'feedbackVariant',
        NoInfer<Variant>,
        NoInfer<Theme>
    >;
};

/** Context fields shared by both field roots, next to styles and tokens. */
export type FieldContextBase = {
    /** Root-owned native input props, including the wrapped handlers. */
    inputProps: TextInputProps;
    /** Active (invalid, visible) validation message, if any. */
    validationMessage: string | undefined;
    message: string | undefined;
    variant: string;
};

/** Supplied by createUI: configured defaults plus instance-bound hooks. */
export type FieldBuilderOptions<
    Definition,
    Variant extends string,
    Theme extends string,
> = {
    defaults: { feedbackVariant: Variant };
    useStyles: (
        options: ResolveComponentOptions<Definition>
    ) => ResolvedComponentResult<Definition>;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

/** Props shared by both field roots; each component adds its own extras. */
export type FieldBaseProps<
    Variant extends string,
    Theme extends string,
    SlotStyles extends object,
> = Omit<
    TextInputProps,
    'style' | 'editable' | 'placeholderTextColor' | 'children'
> & {
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    disabled?: boolean;
    /** Shorthand for a Header child. */
    header?: string;
    /** Default feedback message; shorthand for a Feedback child. */
    feedback?: string | Feedback<Variant>;
    validation?: Validation<Variant>;
    /** Outer container style. */
    style?: StyleProp<ViewStyle>;
    styleOverrides?: StyleOverrides<SlotStyles>;
    /**
     * Compose the Header, Input and Feedback slots in render order; parts
     * that are omitted fall back to their defaults.
     */
    children?: ReactNode;
};
