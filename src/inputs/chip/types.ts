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
} from '../../providers-and-hooks';
import type { StyleOverrides, ThemeMode } from '../../utils/types';

export type ChipSize = 's' | 'm' | 'l';
/** Declaration order is precedence: disabled wins over pressed over selected. */
export type ChipStates = 'selected' | 'pressed' | 'disabled';

export type ChipSlotStyles = {
    container: ViewStyle;
    text: TextStyle;
    icon: ImageStyle;
    /** Styles the default close glyph; custom close content reads tokens. */
    close: TextStyle;
};

export type ChipTokens = {
    fontSize: number;
    /** Leave undefined to use the platform system font. */
    fontFamily: TextStyle['fontFamily'];
    paddingX: ViewStyle['padding'];
    paddingY: ViewStyle['padding'];
    gap: number;
    iconSize: number;
    closeSize: number;
    radius: ViewStyle['borderRadius'];
    borderWidth: number;
    textColor: ColorValue;
    bgColor: ColorValue;
    borderColor: ColorValue;
    iconColor: ColorValue;
    closeColor: ColorValue;
};

export type ChipInfluences<
    Size extends string = ChipSize,
    Theme extends string = ThemeMode,
> = { size: Size; theme: Theme };

export type ChipStyleDefinition<
    Size extends string = ChipSize,
    Theme extends string = ThemeMode,
> = StyleDefinition<
    ChipInfluences<Size, Theme>,
    ChipTokens,
    ChipStates,
    ChipSlotStyles
>;

/** Supplied by createUI: configured defaults plus instance-bound hooks. */
export type ChipBuilderOptions<
    Size extends string = ChipSize,
    Theme extends string = ThemeMode,
> = {
    defaults: { size: Size };
    useStyles: (
        options: ResolveComponentOptions<ChipStyleDefinition<Size, Theme>>
    ) => ResolvedComponentResult<ChipStyleDefinition<Size, Theme>>;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

export type ChipProps<
    Size extends string = ChipSize,
    Theme extends string = ThemeMode,
> = Omit<PressableProps, 'children' | 'style'> & {
    size?: Size;
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    /** Controlled selection; pressing the chip fires onChange with the next value. */
    selected?: boolean;
    /**
     * The chip is interactive only while an interaction handler (onChange,
     * onPress, onPressIn/Out, onLongPress) is supplied. Without one it is a
     * static display item: no pressed feedback, announced as text with
     * `selected` conveyed when true. A close affordance stays operable.
     */
    onChange?: (selected: boolean) => void;
    styleOverrides?: StyleOverrides<ChipSlotStyles>;
    text?: string;
    icon?: ImageSourcePropType;
    /** When the shorthand icon renders: only while selected (default) or always. */
    showIcon?: 'selected' | 'always';
    /** Renders a close affordance (default × glyph) that fires this callback. */
    onClose?: () => void;
    /** Replaces the default × glyph of the shorthand close affordance. */
    closeIcon?: ImageSourcePropType;
    /** Accessibility label for the close affordance. Defaults to "Remove". */
    closeAccessibilityLabel?: string;
    /**
     * Compound slots render in place (icon shorthand before, text/close
     * shorthands after). When composing a slot, compose every visible slot
     * instead of mixing with shorthands, or the visual order may be off.
     */
    children?: ReactNode;
};
