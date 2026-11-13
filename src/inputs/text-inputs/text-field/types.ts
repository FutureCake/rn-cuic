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

/** Shared field contract, re-exported for the text-field entry point. */
export type {
    Feedback,
    FeedbackVariant,
    Validation,
    ValidationResult,
} from '../shared/types';

/** Declaration order matters: disabled is declared last so it wins. */
export type TextFieldStates = FieldStates;

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
> = FieldInfluences<Variant, Theme>;

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
> = FieldBuilderOptions<
    TextFieldStyleDefinition<Variant, Theme>,
    Variant,
    Theme
>;

/**
 * Compose TextField.Header, TextField.Input and TextField.Feedback in render
 * order via children; parts that are omitted fall back to their defaults.
 */
export type TextFieldProps<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = FieldBaseProps<Variant, Theme, TextFieldSlotStyles>;
