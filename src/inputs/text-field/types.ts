import type { ReactNode } from 'react';
import type {
    ColorValue,
    TextInputProps as RNTextInputProps,
    StyleProp,
    TextStyle,
    ViewStyle,
} from 'react-native';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinition,
} from '../../providers-and-hooks';
import type { StyleOverrides } from '../../utils/types';
import type { ThemeMode } from '../button/types';

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
export type TextFieldStates = 'focused' | 'disabled';

export type TextFieldSlotStyles = {
    container: ViewStyle;
    header: TextStyle;
    input: TextStyle;
    feedback: TextStyle;
};

export type TextFieldTokens = {
    fontSize: number;
    headerFontSize: number;
    feedbackFontSize: number;
    /** Leave undefined to use the platform system font. */
    fontFamily: TextStyle['fontFamily'];
    borderWidth: number;
    radius: ViewStyle['borderRadius'];
    paddingX: ViewStyle['padding'];
    paddingY: ViewStyle['padding'];
    /** Space between the header, input and feedback. */
    gap: number;
    textColor: ColorValue;
    placeholderColor: ColorValue;
    bgColor: ColorValue;
    borderColor: ColorValue;
    feedbackColor: ColorValue;
};

export type TextFieldInfluences<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = { feedbackVariant: Variant; theme: Theme };

export type TextFieldStyleDefinition<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = StyleDefinition<
    TextFieldInfluences<Variant, Theme>,
    TextFieldTokens,
    TextFieldStates,
    TextFieldSlotStyles
>;

/** Supplied by createUI: configured defaults plus instance-bound hooks. */
export type TextFieldBuilderOptions<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = {
    defaults: { feedbackVariant: Variant };
    useStyles: (
        options: ResolveComponentOptions<
            TextFieldStyleDefinition<Variant, Theme>
        >
    ) => ResolvedComponentResult<TextFieldStyleDefinition<Variant, Theme>>;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

export type TextFieldProps<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = Omit<
    RNTextInputProps,
    'style' | 'editable' | 'placeholderTextColor' | 'children'
> & {
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    disabled?: boolean;
    /** Shorthand for a TextField.Header child. */
    header?: string;
    /** Default feedback message; shorthand for a TextField.Feedback child. */
    feedback?: string | Feedback<Variant>;
    validation?: Validation<Variant>;
    /** Outer container style. */
    style?: StyleProp<ViewStyle>;
    styleOverrides?: StyleOverrides<TextFieldSlotStyles>;
    /**
     * Compose TextField.Header, TextField.Input and TextField.Feedback in
     * render order; parts that are omitted fall back to their defaults.
     */
    children?: ReactNode;
};
