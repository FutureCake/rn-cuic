import type { ColorValue, PressableProps, ViewStyle } from 'react-native';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinition,
} from '../../providers-and-hooks';
import type { StyleOverrides, ThemeMode } from '../../utils/types';

export type ToggleStates = 'active' | 'disabled';

export type ToggleSlotStyles = {
    container: ViewStyle;
    indicator: ViewStyle;
};

export type ToggleTokens = {
    width: number;
    height: number;
    /** Inner inset between the track border and the indicator. */
    padding: number;
    borderWidth: number;
    radius: ViewStyle['borderRadius'];
    indicatorSize: number;
    /** Indicator translateX; the active state moves it to the far side. */
    indicatorOffset: number;
    bgColor: ColorValue;
    borderColor: ColorValue;
    indicatorColor: ColorValue;
};

export type ToggleInfluences<Theme extends string = ThemeMode> = {
    theme: Theme;
};

export type ToggleStyleDefinition<Theme extends string = ThemeMode> =
    StyleDefinition<
        ToggleInfluences<Theme>,
        ToggleTokens,
        ToggleStates,
        ToggleSlotStyles
    >;

/** Supplied by createUI: instance-bound hooks. */
export type ToggleBuilderOptions<Theme extends string = ThemeMode> = {
    useStyles: (
        options: ResolveComponentOptions<ToggleStyleDefinition<Theme>>
    ) => ResolvedComponentResult<ToggleStyleDefinition<Theme>>;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

export type ToggleProps<Theme extends string = ThemeMode> = Omit<
    PressableProps,
    'children' | 'style'
> & {
    /** Controlled on/off state. */
    active: boolean;
    /** Called with the requested next state on press. */
    onChange?: (active: boolean) => void;
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    styleOverrides?: StyleOverrides<ToggleSlotStyles>;
};
