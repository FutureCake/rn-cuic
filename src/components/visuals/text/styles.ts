import { defineTextStyles } from './define-styles';

const palette = {
    light: { text: '#222222', muted: '#6B6B70' },
    dark: { text: '#F2F2F5', muted: '#A0A0A8' },
} as const;

/**
 * Default preset: a four-step type scale. Titles use the `heading` font role
 * (falling back to `body`); everything else uses `body`. Color and size
 * changes animate, so theme switches fade instead of snapping.
 */
export const textStyleDefinition = defineTextStyles({
    defaultTokens: {
        font: 'body',
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
        color: palette.light.text,
    },
    influenceResolvers: {
        theme: {
            light: { color: palette.light.text },
            dark: { color: palette.dark.text },
        },
        variant: {
            title: {
                font: 'heading',
                fontWeight: 700,
                fontSize: 28,
                lineHeight: 34,
            },
            body: {},
            label: { fontWeight: 500, fontSize: 14, lineHeight: 20 },
            caption: ({ theme }) => ({
                fontSize: 12,
                lineHeight: 16,
                color: palette[theme].muted,
            }),
        },
        weight: {
            regular: { fontWeight: 400 },
            medium: { fontWeight: 500 },
            semibold: { fontWeight: 600 },
            bold: { fontWeight: 700 },
        },
    },
    stateResolvers: {},
    slotStyles: {
        text: (tokens, { font }) => ({
            ...font(tokens.font, tokens.fontWeight),
            fontSize: tokens.fontSize,
            lineHeight: tokens.lineHeight,
            letterSpacing: tokens.letterSpacing,
            color: tokens.color,
        }),
    },
    transition: {
        transitionProperty: ['color', 'fontSize', 'lineHeight'],
        transitionDuration: 150,
    },
});
