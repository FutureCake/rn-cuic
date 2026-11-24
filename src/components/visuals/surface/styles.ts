import { defineSurfaceStyles } from './define-styles';

const palette = {
    light: {
        page: '#FFFFFF',
        tint: '#F2F2F5',
        border: '#D9D9DE',
        shadow: 'rgba(0, 0, 0, 0.12)',
    },
    dark: {
        page: '#121212',
        tint: '#1E1E22',
        border: '#3A3A40',
        shadow: 'rgba(0, 0, 0, 0.5)',
    },
};

/**
 * Default preset. Variant picks fill and border per theme; elevation layers a
 * progressively deeper shadow. The transition animates theme/variant switches.
 */
export const surfaceStyleDefinition = defineSurfaceStyles({
    defaultTokens: {
        surfaceColor: palette.light.page,
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 12,
        shadow: 'none',
    },
    influenceResolvers: {
        variant: {
            framed: ({ theme }) => ({
                surfaceColor: palette[theme].page,
                borderColor: palette[theme].border,
                borderWidth: 1,
            }),
            contained: ({ theme }) => ({
                surfaceColor: palette[theme].tint,
            }),
            neutral: ({ theme }) => ({
                surfaceColor: palette[theme].page,
            }),
        },
        elevation: {
            ground: {},
            first: ({ theme }) => ({
                shadow: `0px 1px 3px ${palette[theme].shadow}`,
            }),
            second: ({ theme }) => ({
                shadow: `0px 4px 10px ${palette[theme].shadow}`,
            }),
            third: ({ theme }) => ({
                shadow: `0px 10px 24px ${palette[theme].shadow}`,
            }),
        },
        theme: {
            light: {},
            dark: {},
        },
    },
    stateResolvers: {},
    slotStyles: {
        surface: (tokens) => ({
            backgroundColor: tokens.surfaceColor,
            borderColor: tokens.borderColor,
            borderWidth: tokens.borderWidth,
            borderRadius: tokens.borderRadius,
            boxShadow: tokens.shadow,
        }),
    },
    transition: { transitionProperty: 'all', transitionDuration: 150 },
});
