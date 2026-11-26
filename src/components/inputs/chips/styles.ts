import { defineChipsStyles } from './define-styles';

const themeColors = {
    light: {
        default: { headerColor: '#222', feedbackColor: '#222' },
        disabled: { headerColor: '#b5b5b5', feedbackColor: '#b5b5b5' },
    },
    dark: {
        default: { headerColor: '#e3e3e3', feedbackColor: '#e3e3e3' },
        disabled: { headerColor: '#6a6a6a', feedbackColor: '#6a6a6a' },
    },
} as const;

/** Default preset: plain group with optional header and feedback text. */
export const chipsStyleDefinition = defineChipsStyles({
    defaultTokens: {
        headerFontSize: 14,
        feedbackFontSize: 14,
        font: 'body',
        headerFontWeight: 400,
        feedbackFontWeight: 400,
        gap: 8,
        rowGap: 8,
        sectionGap: 6,
        ...themeColors.light.default,
    },
    influenceResolvers: {
        layout: { wrap: {}, scroll: {} },
        theme: {
            light: themeColors.light.default,
            dark: themeColors.dark.default,
        },
        // Declared after theme: variants override the theme's feedback color.
        feedbackVariant: {
            info: {},
            warning: { feedbackColor: '#ff0' },
            error: { feedbackColor: '#f00' },
        },
    },
    stateResolvers: {
        disabled: ({ theme }) => themeColors[theme].disabled,
    },
    slotStyles: {
        container: () => ({}),
        content: (tokens) => ({
            columnGap: tokens.gap,
            rowGap: tokens.rowGap,
        }),
        header: (tokens, { font }) => ({
            ...font(tokens.font, tokens.headerFontWeight),
            fontSize: tokens.headerFontSize,
            color: tokens.headerColor,
            marginBottom: tokens.sectionGap,
        }),
        feedback: (tokens, { font }) => ({
            ...font(tokens.font, tokens.feedbackFontWeight),
            fontSize: tokens.feedbackFontSize,
            color: tokens.feedbackColor,
            marginTop: tokens.sectionGap,
        }),
    },
    transition: { transitionProperty: 'all', transitionDuration: 499 },
});
