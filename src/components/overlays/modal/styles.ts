import { defineModalStyles } from './define-styles';

const themeColors = {
    light: {
        backgroundColor: '#FFF',
        borderColor: '#e2e2e2',
    },
    dark: {
        backgroundColor: '#1b1b1b',
        borderColor: '#3a3a3a',
    },
} as const;

/**
 * Default preset: a centered, bordered card over a black scrim. The card
 * hugs its content, capped by `maxWidth` and inset from the screen edges
 * by `marginX`; height follows the content. Entrance/exit motion is
 * behavior, not styling — it lives in the component.
 */
export const modalStyleDefinition = defineModalStyles({
    defaultTokens: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginX: 24,
        maxWidth: 420,
        backdropColor: '#000',
        backdropOpacity: 0.45,
        ...themeColors.light,
    },
    influenceResolvers: {
        theme: {
            light: themeColors.light,
            dark: themeColors.dark,
        },
    },
    stateResolvers: {},
    slotStyles: {
        backdrop: (tokens) => ({
            backgroundColor: tokens.backdropColor,
        }),
        card: (tokens) => ({
            maxWidth: tokens.maxWidth,
            backgroundColor: tokens.backgroundColor,
            borderWidth: tokens.borderWidth,
            borderColor: tokens.borderColor,
            borderRadius: tokens.borderRadius,
            padding: tokens.padding,
        }),
    },
    // Colors only: opacity and transform are driven by the entrance/exit
    // shared value and must not be re-timed by a CSS transition.
    transition: {
        transitionProperty: ['backgroundColor', 'borderColor'],
        transitionDuration: 150,
    },
});
