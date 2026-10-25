import type { ButtonStyleDefinition, ButtonVariant, ThemeMode } from './types';

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

export const buttonStyleDefinition: ButtonStyleDefinition = {
    defaultTokens: {
        alignSelf: 'auto',
        justifyContent: 'center',
        fontSize: 0,
        fontFamily: '',
        paddingX: 0,
        paddingY: 0,
        iconGap: 0,
        iconSize: 0,
        radius: 0,
        ...themeColors.light.default,
    },
    influenceOrder: ['theme', 'variant', 'size'],
    stateOrder: ['pressed', 'disabled'],
    influenceResolvers: {
        themeResolver: {
            light: themeColors.light.default,
            dark: themeColors.dark.default,
        },
        variantResolver: {
            'primary': {
                radius: 8,
                justifyContent: 'center',
                fontFamily: 'SF-Pro-Regular',
            },
            'secondary': ({ theme }) => ({
                radius: 0,
                justifyContent: 'center',
                fontFamily: 'SF-Pro-Light',
                ...transparentColors(theme),
            }),
            'left-to-right': ({ theme }) => ({
                justifyContent: 'flex-start',
                fontFamily: 'SF-Pro-Regular',
                ...transparentColors(theme),
            }),
        },
        sizeResolver: {
            small: ({ variant }) => ({
                radius: variant === 'left-to-right' ? 0 : 9999,
                paddingY: variant === 'left-to-right' ? 0 : 8,
                paddingX: variant === 'left-to-right' ? 0 : 16,
                fontSize: 21,
                iconSize: 32,
            }),
            large: ({ variant }) => ({
                paddingY: 16,
                paddingX: 0,
                fontSize: variant === 'secondary' ? 21 : 28,
                iconSize: 64,
            }),
            xlarge: {
                fontSize: 36,
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
};
