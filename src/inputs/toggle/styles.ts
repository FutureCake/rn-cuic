import { defineToggleStyles } from './define-styles';

const themeColors = {
    light: {
        default: {
            bgColor: '#FFF',
            borderColor: '#b6b6b6',
            indicatorColor: '#000',
        },
        active: {
            bgColor: '#000',
            borderColor: '#b6b6b6',
            indicatorColor: '#FFF',
        },
        disabled: {
            bgColor: '#ddd',
            borderColor: '#ddd',
            indicatorColor: '#6f6f6f',
        },
    },
    dark: {
        default: {
            bgColor: '#1b1b1b',
            borderColor: '#505050',
            indicatorColor: '#FFF',
        },
        active: {
            bgColor: '#FFF',
            borderColor: '#505050',
            indicatorColor: '#000',
        },
        disabled: {
            bgColor: '#505050',
            borderColor: '#505050',
            indicatorColor: '#adadad',
        },
    },
} as const;

/**
 * Default preset: a complete, usable switch out of the box.
 * The active state slides the indicator across the track's free space;
 * the transition animates both the travel and the color changes.
 */
export const toggleStyleDefinition = defineToggleStyles({
    defaultTokens: {
        width: 56,
        height: 32,
        padding: 3,
        borderWidth: 2,
        radius: 18,
        indicatorSize: 22,
        indicatorOffset: 0,
        ...themeColors.light.default,
    },
    influenceResolvers: {
        theme: {
            light: themeColors.light.default,
            dark: themeColors.dark.default,
        },
    },
    stateResolvers: {
        // Travel = width - indicatorSize - 2 * (borderWidth + padding).
        active: ({ theme }) => ({
            ...themeColors[theme].active,
            indicatorOffset: 24,
        }),
        // Declared after active: disabled colors win, the offset remains.
        disabled: ({ theme }) => themeColors[theme].disabled,
    },
    slotStyles: {
        container: (tokens) => ({
            width: tokens.width,
            height: tokens.height,
            padding: tokens.padding,
            borderRadius: tokens.radius,
            borderWidth: tokens.borderWidth,
            borderColor: tokens.borderColor,
            backgroundColor: tokens.bgColor,
            justifyContent: 'center',
            overflow: 'hidden',
        }),
        indicator: (tokens) => ({
            width: tokens.indicatorSize,
            height: tokens.indicatorSize,
            borderRadius: tokens.indicatorSize / 2,
            backgroundColor: tokens.indicatorColor,
            transform: [{ translateX: tokens.indicatorOffset }],
        }),
    },
    transition: { transitionProperty: 'all', transitionDuration: 500 },
});
