import type { ReactNode } from 'react';
import type {
    ColorValue,
    StyleProp,
    TextStyle,
    ViewProps,
    ViewStyle,
} from 'react-native';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinition,
} from '../../providers-and-hooks';
import type { StyleOverrides } from '../../utils/types';
import type { ThemeMode } from '../button/types';

export type SwitchStates = 'disabled';

export type SwitchSlotStyles = {
    container: ViewStyle;
    indicator: ViewStyle;
    option: ViewStyle;
    optionText: TextStyle;
};

export type SwitchTokens = {
    fontSize: number;
    /** Leave undefined to use the platform system font. */
    fontFamily: TextStyle['fontFamily'];
    borderWidth: number;
    radius: ViewStyle['borderRadius'];
    /** Inner inset between the border and the options; also offsets the indicator. */
    padding: number;
    optionPaddingX: ViewStyle['padding'];
    optionPaddingY: ViewStyle['padding'];
    bgColor: ColorValue;
    borderColor: ColorValue;
    indicatorColor: ColorValue;
    textColor: ColorValue;
    /** Text color of the option behind the indicator. */
    activeTextColor: ColorValue;
};

export type SwitchInfluences<Theme extends string = ThemeMode> = {
    theme: Theme;
};

export type SwitchStyleDefinition<Theme extends string = ThemeMode> =
    StyleDefinition<
        SwitchInfluences<Theme>,
        SwitchTokens,
        SwitchStates,
        SwitchSlotStyles
    >;

/** Supplied by createUI: instance-bound hooks. */
export type SwitchBuilderOptions<Theme extends string = ThemeMode> = {
    useStyles: (
        options: ResolveComponentOptions<SwitchStyleDefinition<Theme>>
    ) => ResolvedComponentResult<SwitchStyleDefinition<Theme>>;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

export type SwitchOptionData<Value> = {
    title: string;
    value: Value;
};

export type SwitchProps<Value, Theme extends string = ThemeMode> = Omit<
    ViewProps,
    'children' | 'style'
> & {
    /** Shorthand for Switch.Option children; ignored when slots are present. */
    options?: SwitchOptionData<Value>[];
    /** Controlled selection: the value of the active option. */
    value: Value;
    /** Called with the pressed option's value. */
    onChange?: (value: Value) => void;
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    disabled?: boolean;
    /** Outer container style. */
    style?: StyleProp<ViewStyle>;
    styleOverrides?: StyleOverrides<SwitchSlotStyles>;
    /** Compose Switch.Option elements; exclusive with `options`. */
    children?: ReactNode;
};
