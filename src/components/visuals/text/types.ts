import type {
    ColorValue,
    TextProps as NativeTextProps,
    StyleProp,
    TextStyle,
} from 'react-native';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinition,
} from '../../../providers-and-hooks';
import type {
    FontRole,
    FontWeight,
    StyleOverrides,
    ThemeMode,
} from '../../../shared/types';

/** The preset type scale; custom definitions may name any variants. */
export type TextVariant = 'title' | 'body' | 'label' | 'caption';
/** Named weights; omitted, the variant's own weight applies. */
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
/** Text has no runtime states. */
export type TextStates = never;

export type TextSlotStyles = {
    text: TextStyle;
};

export type TextTokens = {
    /** Role from createUI fonts; falls back to body, then the system font. */
    font: FontRole;
    fontWeight: FontWeight;
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
    color: ColorValue;
};

/**
 * Declaration order matters: theme first so variant callbacks can set
 * theme-aware colors, weight last so an explicit weight wins.
 */
export type TextInfluences<
    Variant extends string = TextVariant,
    Weight extends string = TextWeight,
    Theme extends string = ThemeMode,
> = { theme: Theme; variant: Variant; weight?: Weight };

export type TextStyleDefinition<
    Variant extends string = TextVariant,
    Weight extends string = TextWeight,
    Theme extends string = ThemeMode,
> = StyleDefinition<
    TextInfluences<Variant, Weight, Theme>,
    TextTokens,
    TextStates,
    TextSlotStyles
>;

/** Supplied by createUI: configured defaults plus instance-bound hooks. */
export type TextBuilderOptions<
    Variant extends string = TextVariant,
    Weight extends string = TextWeight,
    Theme extends string = ThemeMode,
> = {
    defaults: { variant: Variant };
    useStyles: (
        options: ResolveComponentOptions<
            TextStyleDefinition<Variant, Weight, Theme>
        >
    ) => ResolvedComponentResult<TextStyleDefinition<Variant, Weight, Theme>>;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

/**
 * A nested Text inherits its parent's variant, weight, theme and color unless
 * it sets them itself.
 */
export type TextProps<
    Variant extends string = TextVariant,
    Weight extends string = TextWeight,
    Theme extends string = ThemeMode,
> = Omit<NativeTextProps, 'style'> & {
    variant?: Variant;
    /** Overrides the variant's weight. */
    weight?: Weight;
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    /** Overrides the resolved text color. */
    color?: ColorValue;
    styleOverrides?: StyleOverrides<TextSlotStyles>;
    /** Merged into the text slot override. */
    style?: StyleProp<TextStyle>;
};
