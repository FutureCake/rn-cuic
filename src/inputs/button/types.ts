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

export type ButtonStyleDefinition = StyleDefinition<
    { variant: ButtonVariant; size: ButtonSize; theme: ThemeMode },
    ButtonTokens,
    ButtonStates,
    { container: ViewStyle; text: TextStyle; icon: ImageStyle }
>;

type ButtonBaseProps = Omit<PressableProps, 'children' | 'style'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    theme?: ThemeMode;
    styleOverrides?: StyleOverrides<ButtonSlots>;
};

export type ButtonProps = ButtonBaseProps & {
    /** Fallback label, replaced by an explicit Button.Text child. */
    text?: string;
    /** Fallback leading image, replaced by an explicit Button.Icon child. */
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
    | (Omit<ImageProps, 'source' | 'children'> & {
          source: ImageSourcePropType;
          children?: never;
      })
    | {
          source?: never;
          /** Custom nodes own their styles; callbacks receive the slot style. */
          children: ReactNode | ((props: ButtonIconRenderProps) => ReactNode);
          style?: StyleProp<ImageStyle>;
      };
