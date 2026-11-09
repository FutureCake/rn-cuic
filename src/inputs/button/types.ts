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
    ResolvedComponentTokens,
    StyleDefinition,
} from '../../providers-and-hooks';
import type { StyleOverrides } from '../../utils/types';

export type ButtonVariant = 'primary' | 'secondary' | 'left-to-right';
export type ButtonSize = 'small' | 'large' | 'xlarge';
export type ThemeMode = 'light' | 'dark';
export type ButtonSlots = 'container' | 'text' | 'icon';
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
    fontFamily: string;
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
    { container: ViewStyle; text: TextStyle; icon: ImageStyle }
>;

export type ButtonProps<
    Variant extends string = ButtonVariant,
    Size extends string = ButtonSize,
    Theme extends string = ThemeMode,
> = Omit<PressableProps, 'children' | 'style'> & {
    variant?: Variant;
    size?: Size;
    theme?: Theme;
    styleOverrides?: StyleOverrides<ButtonSlots>;
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
