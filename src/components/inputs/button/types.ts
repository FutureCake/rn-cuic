import type { ReactNode } from 'react';
import type {
    ColorValue,
    ImageSourcePropType,
    ImageStyle,
    PressableProps,
    TextStyle,
    ViewStyle,
} from 'react-native';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinition,
} from '../../../providers-and-hooks';
import type {
    FontRole,
    FontWeight,
    Size as SizeScale,
    StyleOverrides,
    ThemeMode,
} from '../../../shared/types';

/**
 * Fill and emphasis: `solid` is the filled brand button, `outline` keeps the
 * footprint but swaps the fill for a border, `ghost` keeps the footprint but
 * drops the fill, `text` is a bare label with no padding or background.
 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'text';
/**
 * Footprint and corners: `block` stretches to full width with a modest
 * radius, `hug` hugs its content with the same modest radius, `pill` hugs its
 * content with fully rounded corners.
 */
export type ButtonShape = 'block' | 'hug' | 'pill';
export type ButtonSize = Extract<SizeScale, 's' | 'm' | 'l' | 'xl'>;
export type ButtonStates = 'pressed' | 'disabled';
/**
 * Content flags derived from what the button renders: `hasIcon` for an
 * `icon` prop or `Button.Icon` child, `hasText` for a `text` prop or
 * `Button.Text` child. Combine them in callbacks, for example icon-only is
 * `hasIcon` with `{ hasText: false }`.
 */
export type ButtonStructure = 'hasIcon' | 'hasText';

export type ButtonSlotStyles = {
    container: ViewStyle;
    text: TextStyle;
    icon: ImageStyle;
};

export type ButtonTokens = {
    alignSelf: ViewStyle['alignSelf'];
    justifyContent: ViewStyle['justifyContent'];
    fontSize: number;
    /** Role from createUI fonts; falls back to body, then the system font. */
    font: FontRole;
    fontWeight: FontWeight;
    paddingX: ViewStyle['padding'];
    paddingY: ViewStyle['padding'];
    iconGap: number;
    iconSize: number;
    radius: ViewStyle['borderRadius'];
    textColor: ColorValue;
    bgColor: ColorValue;
    borderColor: ColorValue;
    borderWidth: number;
    scale: number;
};

export type ButtonInfluences<
    Variant extends string = ButtonVariant,
    Shape extends string = ButtonShape,
    Size extends string = ButtonSize,
    Theme extends string = ThemeMode,
> = { variant: Variant; shape: Shape; size: Size; theme: Theme };

export type ButtonStyleDefinition<
    Variant extends string = ButtonVariant,
    Shape extends string = ButtonShape,
    Size extends string = ButtonSize,
    Theme extends string = ThemeMode,
> = StyleDefinition<
    ButtonInfluences<Variant, Shape, Size, Theme>,
    ButtonTokens,
    ButtonStates,
    ButtonSlotStyles,
    ButtonStructure
>;

/** Supplied by createUI: configured defaults plus instance-bound hooks. */
export type ButtonBuilderOptions<
    Variant extends string = ButtonVariant,
    Shape extends string = ButtonShape,
    Size extends string = ButtonSize,
    Theme extends string = ThemeMode,
> = {
    defaults: { variant: Variant; shape: Shape; size: Size };
    useStyles: (
        options: ResolveComponentOptions<
            ButtonStyleDefinition<Variant, Shape, Size, Theme>
        >
    ) => ResolvedComponentResult<
        ButtonStyleDefinition<Variant, Shape, Size, Theme>
    >;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

export type ButtonProps<
    Variant extends string = ButtonVariant,
    Shape extends string = ButtonShape,
    Size extends string = ButtonSize,
    Theme extends string = ThemeMode,
> = Omit<PressableProps, 'children' | 'style'> & {
    variant?: Variant;
    shape?: Shape;
    size?: Size;
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    styleOverrides?: StyleOverrides<ButtonSlotStyles>;
    text?: string;
    icon?: ImageSourcePropType;
    children?: ReactNode;
};
