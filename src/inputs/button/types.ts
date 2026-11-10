import type { ReactNode } from 'react';
import type {
    ColorValue,
    ImageProps,
    ImageSourcePropType,
    ImageStyle,
    PressableProps,
    StyleProp,
    TextProps,
    TextStyle,
    ViewStyle,
} from 'react-native';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    ResolvedComponentTokens,
    StyleDefinition,
} from '../../providers-and-hooks';
import type { StyleOverrides } from '../../utils/types';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'small' | 'large' | 'xlarge';
export type ThemeMode = 'light' | 'dark';
export type ButtonSlotStyles = {
    container: ViewStyle;
    text: TextStyle;
    icon: ImageStyle;
};
export type ButtonSlots = keyof ButtonSlotStyles;
export type ButtonStates = 'pressed' | 'disabled';

export type ButtonInfluences<
    Variant extends string = ButtonVariant,
    Size extends string = ButtonSize,
    Theme extends string = ThemeMode,
> = { variant: Variant; size: Size; theme: Theme };

export type ButtonTokens = {
    alignSelf: ViewStyle['alignSelf'];
    justifyContent: ViewStyle['justifyContent'];
    fontSize: number;
    /** Leave undefined to use the platform system font. */
    fontFamily: TextStyle['fontFamily'];
    paddingX: ViewStyle['padding'];
    paddingY: ViewStyle['padding'];
    iconGap: number;
    iconSize: number;
    radius: ViewStyle['borderRadius'];
    textColor: ColorValue;
    bgColor: ColorValue;
    iconColor: ColorValue;
};

export type ButtonStyleDefinition<
    Variant extends string = ButtonVariant,
    Size extends string = ButtonSize,
    Theme extends string = ThemeMode,
> = StyleDefinition<
    ButtonInfluences<Variant, Size, Theme>,
    ButtonTokens,
    ButtonStates,
    ButtonSlotStyles
>;

/** Supplied by createUI: configured defaults plus instance-bound hooks. */
export type ButtonBuilderOptions<
    Variant extends string = ButtonVariant,
    Size extends string = ButtonSize,
    Theme extends string = ThemeMode,
> = {
    defaults: { variant: Variant; size: Size };
    useStyles: (
        options: ResolveComponentOptions<
            ButtonStyleDefinition<Variant, Size, Theme>
        >
    ) => ResolvedComponentResult<ButtonStyleDefinition<Variant, Size, Theme>>;
    useTheme: () => { theme: Theme; setTheme: (theme: Theme) => void };
};

export type ButtonProps<
    Variant extends string = ButtonVariant,
    Size extends string = ButtonSize,
    Theme extends string = ThemeMode,
> = Omit<PressableProps, 'children' | 'style'> & {
    variant?: Variant;
    size?: Size;
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    styleOverrides?: StyleOverrides<ButtonSlotStyles>;
    text?: string;
    icon?: ImageSourcePropType;
    children?: ReactNode;
};

export type ButtonTextProps = TextProps;

export type ButtonIconRenderProps = {
    tokens: ResolvedComponentTokens<ButtonStyleDefinition>;
    style: StyleProp<ImageStyle>;
    pressed: boolean;
    disabled: boolean;
};

export type ButtonIconProps =
    | (Omit<ImageProps, 'children'> & {
        children?: never;
    })
    | {
        source?: never;
        children: ReactNode | ((props: ButtonIconRenderProps) => ReactNode);
        style?: StyleProp<ImageStyle>;
    };
