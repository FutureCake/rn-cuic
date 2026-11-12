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
import type {
    Feedback,
    FeedbackVariant,
    Validation,
} from '../text-field/types';

/** TextArea shares the TextField feedback and validation contract. */
export type {
    Feedback,
    FeedbackVariant,
    Validation,
    ValidationResult,
} from '../text-field/types';

/** Declaration order matters: disabled is declared last so it wins. */
export type TextAreaStates = 'focused' | 'disabled';

export type TextAreaSlotStyles = {
    container: ViewStyle;
    header: TextStyle;
    input: TextStyle;
    feedback: TextStyle;
};

export type TextAreaTokens = {
    fontSize: number;
    headerFontSize: number;
    feedbackFontSize: number;
    /** Leave undefined to use the platform system font. */
    fontFamily: TextStyle['fontFamily'];
    borderWidth: number;
    radius: ViewStyle['borderRadius'];
    paddingX: ViewStyle['padding'];
    /** Numeric: participates in the numLines/grow height calculation. */
    paddingY: number;
    /** Space between the header, input and feedback. */
    gap: number;
    textColor: ColorValue;
    placeholderColor: ColorValue;
    bgColor: ColorValue;
    borderColor: ColorValue;
    feedbackColor: ColorValue;
};

export type TextAreaInfluences<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = { feedbackVariant: Variant; theme: Theme };

export type TextAreaStyleDefinition<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = StyleDefinition<
    TextAreaInfluences<Variant, Theme>,
    TextAreaTokens,
    TextAreaStates,
    TextAreaSlotStyles
>;

/** Supplied by createUI: configured defaults plus instance-bound hooks. */
export type TextAreaBuilderOptions<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = {
    defaults: { feedbackVariant: Variant };
    useStyles: (
        options: ResolveComponentOptions<
            TextAreaStyleDefinition<Variant, Theme>
        >
    ) => ResolvedComponentResult<TextAreaStyleDefinition<Variant, Theme>>;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

export type TextAreaProps<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = Omit<
    RNTextInputProps,
    | 'style'
    | 'editable'
    | 'placeholderTextColor'
    | 'children'
    | 'multiline'
    | 'numberOfLines'
> & {
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    disabled?: boolean;
    /**
     * Height of the input in text lines (the minimum while growing); content
     * beyond it scrolls unless the field grows. Defaults to 4.
     */
    numLines?: number;
    /** Grow with the content instead of scrolling past numLines. */
    grow?: boolean;
    /** Caps growth at this many lines; supplying it implies `grow`. */
    maxLines?: number;
    /** Shorthand for a TextArea.Header child. */
    header?: string;
    /** Default feedback message; shorthand for a TextArea.Feedback child. */
    feedback?: string | Feedback<Variant>;
    validation?: Validation<Variant>;
    /** Outer container style. */
    style?: StyleProp<ViewStyle>;
    styleOverrides?: StyleOverrides<TextAreaSlotStyles>;
    /**
     * Compose TextArea.Header, TextArea.Input and TextArea.Feedback in
     * render order; parts that are omitted fall back to their defaults.
     */
    children?: ReactNode;
};
