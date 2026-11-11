import { defineChipStyles } from './define-styles';

const themeColors = {
    light: {
        default: {
            bgColor: 'transparent',
            borderColor: '#c9c9c9',
            textColor: '#222',
            iconColor: '#222',
            closeColor: '#666',
        },
        selected: {
            bgColor: '#222',
            borderColor: '#222',
            textColor: '#FFF',
            iconColor: '#FFF',
            closeColor: '#FFF',
        },
        pressed: {
            bgColor: '#444',
            borderColor: '#444',
            textColor: '#FFF',
            iconColor: '#FFF',
            closeColor: '#FFF',
        },
        disabled: {
            bgColor: 'transparent',
            borderColor: '#e3e3e3',
            textColor: '#b5b5b5',
            iconColor: '#b5b5b5',
            closeColor: '#b5b5b5',
        },
    },
    dark: {
        default: {
            bgColor: 'transparent',
            borderColor: '#5a5a5a',
            textColor: '#e3e3e3',
            iconColor: '#e3e3e3',
            closeColor: '#adadad',
        },
        selected: {
            bgColor: '#e3e3e3',
            borderColor: '#e3e3e3',
            textColor: '#000',
            iconColor: '#000',
            closeColor: '#000',
        },
        pressed: {
            bgColor: '#aaa',
            borderColor: '#aaa',
            textColor: '#000',
            iconColor: '#000',
            closeColor: '#000',
        },
        disabled: {
            bgColor: 'transparent',
            borderColor: '#404040',
            textColor: '#6a6a6a',
            iconColor: '#6a6a6a',
            closeColor: '#6a6a6a',
        },
    },
} as const;

/**
 * Default preset: an outlined pill that fills when selected.
 * Every size supplies its full scale; fonts default to the platform system font.
 */
export const chipStyleDefinition = defineChipStyles({
    defaultTokens: {
        fontSize: 15,
        fontFamily: undefined,
        paddingX: 12,
        paddingY: 6,
        gap: 6,
        iconSize: 16,
        closeSize: 16,
        radius: 999,
        borderWidth: 1,
        ...themeColors.light.default,
    },
    influenceResolvers: {
        theme: {
            light: themeColors.light.default,
            dark: themeColors.dark.default,
        },
        size: {
            s: {
                paddingX: 10,
                paddingY: 4,
                fontSize: 13,
                gap: 4,
                iconSize: 14,
                closeSize: 14,
            },
            m: {},
            l: {
                paddingX: 16,
                paddingY: 8,
                fontSize: 17,
                gap: 8,
                iconSize: 20,
                closeSize: 18,
            },
        },
    },
    stateResolvers: {
        selected: ({ theme }) => themeColors[theme].selected,
        pressed: ({ theme }) => themeColors[theme].pressed,
        disabled: ({ theme }) => themeColors[theme].disabled,
    },
    slotStyles: {
        container: (tokens) => ({
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: tokens.gap,
            paddingHorizontal: tokens.paddingX,
            paddingVertical: tokens.paddingY,
            borderRadius: tokens.radius,
            borderWidth: tokens.borderWidth,
            borderColor: tokens.borderColor,
            backgroundColor: tokens.bgColor,
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
        close: (tokens) => ({
            fontFamily: tokens.fontFamily,
            fontSize: tokens.closeSize,
            color: tokens.closeColor,
        }),
    },
    transition: { transitionProperty: 'all', transitionDuration: 150 },
});
