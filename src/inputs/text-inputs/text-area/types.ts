import type { ColorValue, TextStyle, ViewStyle } from 'react-native';
import type { StyleDefinition } from '../../../providers-and-hooks';
import type { ThemeMode } from '../../../utils/types';
import type {
    FeedbackVariant,
    FieldBaseProps,
    FieldBuilderOptions,
    FieldInfluences,
    FieldStates,
} from '../shared/types';

/** Shared field contract, re-exported for the text-area entry point. */
export type {
    Feedback,
    FeedbackVariant,
    Validation,
    ValidationResult,
} from '../shared/types';

/** Declaration order matters: disabled is declared last so it wins. */
export type TextAreaStates = FieldStates;

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
> = FieldInfluences<Variant, Theme>;

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
> = FieldBuilderOptions<
    TextAreaStyleDefinition<Variant, Theme>,
    Variant,
    Theme
>;

/**
 * Compose TextArea.Header, TextArea.Input and TextArea.Feedback in render
 * order via children; parts that are omitted fall back to their defaults.
 *
 * Height measurement reads the resolved `fontSize`/`fontFamily` tokens, so
 * change text metrics through the style definition (or StylesProvider
 * overrides) rather than `styleOverrides.input` or `TextArea.Input`'s own
 * style, or the measured line height will drift from the rendered text.
 */
export type TextAreaProps<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = Omit<
    FieldBaseProps<Variant, Theme, TextAreaSlotStyles>,
    'multiline' | 'numberOfLines'
> & {
    /**
     * Height of the input in text lines (the minimum while growing); content
     * beyond it scrolls unless the field grows. Defaults to 4.
     */
    numLines?: number;
    /** Grow with the content instead of scrolling past numLines. */
    grow?: boolean;
    /** Caps growth at this many lines; supplying it implies `grow`. */
    maxLines?: number;
};
