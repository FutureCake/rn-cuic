import type {
    ColorValue,
    ImageProps,
    ImageSourcePropType,
    ImageStyle,
    StyleProp,
} from 'react-native';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinition,
} from '../../../providers-and-hooks';
import type {
    Size as SizeScale,
    StyleOverrides,
    ThemeMode,
} from '../../../shared/types';

export type IconSize = SizeScale;
/** Icon has no runtime states. */
export type IconStates = never;

export type IconSlotStyles = {
    icon: ImageStyle;
};

export type IconTokens = {
    /** Rendered width; the icon keeps a square aspect ratio. */
    iconSize: number;
    iconColor: ColorValue;
};

export type IconInfluences<
    Size extends string = IconSize,
    Theme extends string = ThemeMode,
> = { size: Size; theme: Theme };

export type IconStyleDefinition<
    Size extends string = IconSize,
    Theme extends string = ThemeMode,
> = StyleDefinition<
    IconInfluences<Size, Theme>,
    IconTokens,
    IconStates,
    IconSlotStyles
>;

/** Supplied by createUI: configured defaults plus instance-bound hooks. */
export type IconBuilderOptions<
    Size extends string = IconSize,
    Theme extends string = ThemeMode,
> = {
    defaults: { size: Size };
    useStyles: (
        options: ResolveComponentOptions<IconStyleDefinition<Size, Theme>>
    ) => ResolvedComponentResult<IconStyleDefinition<Size, Theme>>;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

export type IconProps<
    Size extends string = IconSize,
    Theme extends string = ThemeMode,
> = Omit<ImageProps, 'source' | 'style'> & {
    source: ImageSourcePropType;
    size?: Size;
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    styleOverrides?: StyleOverrides<IconSlotStyles>;
    /** Merged into the icon slot override. */
    style?: StyleProp<ImageStyle>;
};
