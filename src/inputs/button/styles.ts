import type { TextStyle, ViewStyle } from 'react-native';
import type { StyleDefinition } from '../../providers-and-hooks/styles-manager/types';

export type ButtonVariant = 'rounded' | 'square';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ThemeMode = 'light' | 'dark';
export type ButtonSlots = 'container' | 'text';
export type ButtonStates = 'pressed' | 'disabled';
export type ButtonTokens = { outline: string };

export type ButtonStyleDefinition = StyleDefinition<
  { variant: ButtonVariant; size: ButtonSize; theme: ThemeMode },
  ButtonTokens,
  ButtonStates,
  { container: ViewStyle; text: TextStyle }
>;

export const buttonStyleDefinition: ButtonStyleDefinition = {
  defaultTokens: { outline: '#202020' },
  influenceOrder: ['theme', 'variant', 'size'],
  stateOrder: ['pressed', 'disabled'],
  influenceResolvers: {
    themeResolver: {
      light: { outline: '#202020' },
      dark: { outline: '#eeeeee' },
    },
    variantResolver: { rounded: {}, square: {} },
    sizeResolver: { small: {}, medium: {}, large: {} },
  },
  stateResolvers: {
    pressed: { outline: '#6750a4' },
    disabled: {
      dark: { outline: '#777777' },
      light: { outline: '#aaaaaa' },
    },
  },
  slotStyles: {
    container: (tokens) => ({
      borderColor: tokens.outline,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    }),
    text: (tokens) => ({ color: tokens.outline }),
  },
  transition: { transitionProperty: 'all', transitionDuration: 150 },
};
