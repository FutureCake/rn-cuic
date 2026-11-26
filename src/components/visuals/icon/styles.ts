import { defineIconStyles } from './define-styles';

/**
 * Default preset: a square, tintable icon on the shared size scale.
 * The transition animates tint and size changes (for example theme switches).
 */
export const iconStyleDefinition = defineIconStyles({
    defaultTokens: {
        iconSize: 28,
        iconColor: '#000',
    },
    influenceResolvers: {
        size: {
            xs: { iconSize: 12 },
            s: { iconSize: 18 },
            m: { iconSize: 28 },
            l: { iconSize: 36 },
            xl: { iconSize: 60 },
        },
        theme: {
            light: { iconColor: '#000' },
            dark: { iconColor: '#FFF' },
        },
    },
    stateResolvers: {},
    slotStyles: {
        icon: (tokens) => ({
            width: tokens.iconSize,
            aspectRatio: 1,
            resizeMode: 'contain',
            tintColor: tokens.iconColor,
        }),
    },
    transition: { transitionProperty: 'all', transitionDuration: 499 },
});
