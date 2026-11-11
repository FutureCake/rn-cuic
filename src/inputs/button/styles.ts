import { defineButtonStyles } from './define-styles';
import type { ButtonVariant, ThemeMode } from './types';

const themeColors = {
    light: {
        default: { bgColor: '#222', textColor: '#FFF', iconColor: '#FFF' },
        disabled: {
            bgColor: '#cbcbcb',
            textColor: '#e3e3e3',
            iconColor: '#e3e3e3',
        },
        pressed: { bgColor: '#000', textColor: '#FFF', iconColor: '#FFF' },
    },
    dark: {
        default: { bgColor: '#c3c3c3', textColor: '#000', iconColor: '#000' },
        disabled: {
            bgColor: '#505050',
            textColor: '#adadad',
            iconColor: '#adadad',
        },
        pressed: { bgColor: '#FFF', textColor: '#000', iconColor: '#000' },
    },
} as const;

function transparentColors(theme: ThemeMode) {
    const color = theme === 'light' ? '#000' : '#FFF';
    return { bgColor: 'transparent', textColor: color, iconColor: color };
}

function stateColors(
    theme: ThemeMode,
    variant: ButtonVariant,
    state: 'pressed' | 'disabled'
) {
    const colors = themeColors[theme][state];
    return variant === 'primary'
        ? colors
        : { ...colors, bgColor: 'transparent' };
}

/**
 * Default preset: a complete, usable button out of the box.
 * Every size supplies its full scale; fonts default to the platform system font.
 */
export const buttonStyleDefinition = defineButtonStyles({
    defaultTokens: {
        alignSelf: 'auto',
        justifyContent: 'center',
        fontSize: 17,
        fontFamily: undefined,
        paddingX: 16,
        paddingY: 10,
        iconGap: 8,
        iconSize: 20,
        radius: 8,
        ...themeColors.light.default,
    },
    influenceResolvers: {
        theme: {
            light: themeColors.light.default,
            dark: themeColors.dark.default,
        },
        variant: {
            primary: {},
            secondary: ({ theme }) => transparentColors(theme),
        },
        size: {
            small: {
                paddingX: 16,
                paddingY: 8,
                fontSize: 15,
                iconSize: 18,
                iconGap: 6,
                radius: 8,
            },
            large: {
                paddingX: 24,
                paddingY: 14,
                fontSize: 20,
                iconSize: 24,
                iconGap: 8,
                radius: 10,
            },
            xlarge: {
                paddingX: 32,
                paddingY: 18,
                fontSize: 24,
                iconSize: 28,
                iconGap: 10,
                radius: 12,
            },
        },
    },
    stateResolvers: {
        pressed: ({ theme, variant }) => stateColors(theme, variant, 'pressed'),
        disabled: ({ theme, variant }) =>
            stateColors(theme, variant, 'disabled'),
    },
    slotStyles: {
        container: (tokens) => ({
            paddingHorizontal: tokens.paddingX,
            paddingVertical: tokens.paddingY,
            borderRadius: tokens.radius,
            backgroundColor: tokens.bgColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: tokens.justifyContent,
            alignSelf: tokens.alignSelf,
            gap: tokens.iconGap,
        }),
        text: (tokens) => ({
            fontFamily: tokens.fontFamily,
            fontSize: tokens.fontSize,
            color: tokens.textColor,
        }),
        icon: (tokens) => ({
            tintColor: tokens.iconColor,
            width: tokens.iconSize,
            height: tokens.iconSize,
            resizeMode: 'contain',
        }),
    },
    transition: { transitionProperty: 'all', transitionDuration: 150 },
});
