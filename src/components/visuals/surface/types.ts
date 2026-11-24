import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinition,
} from '../../../providers-and-hooks';
import type { StyleOverrides, ThemeMode } from '../../../shared/types';
import type { BoxPadding } from '../../layouts/box';

/** framed: outlined; contained: tinted fill; neutral: page-colored, no border. */
export type SurfaceVariant = 'framed' | 'contained' | 'neutral';
/** Depth above the page; `ground` is flat (no shadow). */
export type SurfaceElevation = 'ground' | 'first' | 'second' | 'third';
/** Surface has no runtime states. */
export type SurfaceStates = never;

export type SurfaceSlotStyles = {
    surface: ViewStyle;
};

export type SurfaceTokens = {
    surfaceColor: ColorValue;
    borderColor: ColorValue;
    borderWidth: number;
    borderRadius: number;
    /** CSS-like box shadow, e.g. `0px 2px 6px rgba(0,0,0,0.12)`; `none` for flat. */
    shadow: NonNullable<ViewStyle['boxShadow']>;
};

export type SurfaceInfluences<
    Variant extends string = SurfaceVariant,
    Elevation extends string = SurfaceElevation,
    Theme extends string = ThemeMode,
> = { variant: Variant; elevation: Elevation; theme: Theme };

export type SurfaceStyleDefinition<
    Variant extends string = SurfaceVariant,
    Elevation extends string = SurfaceElevation,
    Theme extends string = ThemeMode,
> = StyleDefinition<
    SurfaceInfluences<Variant, Elevation, Theme>,
    SurfaceTokens,
    SurfaceStates,
    SurfaceSlotStyles
>;

/** Supplied by createUI: configured defaults plus instance-bound hooks. */
export type SurfaceBuilderOptions<
    Variant extends string = SurfaceVariant,
    Elevation extends string = SurfaceElevation,
    Theme extends string = ThemeMode,
> = {
    defaults: { variant: Variant; elevation: Elevation };
    useStyles: (
        options: ResolveComponentOptions<
            SurfaceStyleDefinition<Variant, Elevation, Theme>
        >
    ) => ResolvedComponentResult<
        SurfaceStyleDefinition<Variant, Elevation, Theme>
    >;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

export type SurfaceProps<
    Variant extends string = SurfaceVariant,
    Elevation extends string = SurfaceElevation,
    Theme extends string = ThemeMode,
> = Omit<ViewProps, 'style'> & {
    variant?: Variant;
    elevation?: Elevation;
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    /** Overrides the resolved surface color. */
    color?: ColorValue;
    /** Overrides the resolved corner radius. */
    radius?: number;
    /** Inner padding; when set, children are wrapped in a Box. */
    padding?: BoxPadding;
    styleOverrides?: StyleOverrides<SurfaceSlotStyles>;
    /** Merged into the surface slot override. */
    style?: StyleProp<ViewStyle>;
};
