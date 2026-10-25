import type {
    ColorValue,
    ImageStyle,
    PressableProps,
    TextStyle,
    ViewStyle,
} from 'react-native';
import type { StyleDefinition } from '../../providers-and-hooks';
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

export interface ButtonProps extends Omit<
    PressableProps,
    'children' | 'style'
> {
    text: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    theme?: ThemeMode;
    styleOverrides?: StyleOverrides<ButtonSlots>;
}
