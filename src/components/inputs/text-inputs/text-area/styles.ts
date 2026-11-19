import { defineTextAreaStyles } from './define-styles';

const themeColors = {
    light: {
        default: {
            bgColor: '#FFF',
            textColor: '#222',
            placeholderColor: '#9a9a9a',
            borderColor: '#222',
            feedbackColor: '#222',
        },
        focused: { borderColor: '#000' },
        disabled: {
            bgColor: '#FFF',
            textColor: '#DEDEDE',
            placeholderColor: '#DEDEDE',
            borderColor: '#E7E7E7',
            feedbackColor: '#DEDEDE',
        },
    },
    dark: {
        default: {
            bgColor: '#c3c3c3',
            textColor: '#000',
            placeholderColor: '#5f5f5f',
            borderColor: '#000',
            feedbackColor: '#222',
        },
        focused: { borderColor: '#FFF' },
        disabled: {
            bgColor: '#505050',
            textColor: '#adadad',
            placeholderColor: '#adadad',
            borderColor: '#adadad',
            feedbackColor: '#222',
        },
    },
} as const;

/** Default preset: a bordered multiline input with header and feedback text. */
export const textAreaStyleDefinition = defineTextAreaStyles({
    defaultTokens: {
        fontSize: 16,
        headerFontSize: 14,
        feedbackFontSize: 14,
        fontFamily: undefined,
        borderWidth: 1,
        radius: 8,
        paddingX: 20,
        paddingY: 12,
        gap: 6,
        ...themeColors.light.default,
    },
    influenceResolvers: {
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
        focused: ({ theme }) => themeColors[theme].focused,
        // Declared last: disabled colors win over feedback colors.
        disabled: ({ theme }) => themeColors[theme].disabled,
    },
    slotStyles: {
        container: () => ({}),
        header: (tokens) => ({
            fontFamily: tokens.fontFamily,
            fontSize: tokens.headerFontSize,
            color: tokens.textColor,
            marginBottom: tokens.gap,
        }),
        input: (tokens) => ({
            fontFamily: tokens.fontFamily,
            fontSize: tokens.fontSize,
            color: tokens.textColor,
            backgroundColor: tokens.bgColor,
            borderColor: tokens.borderColor,
            borderWidth: tokens.borderWidth,
            borderRadius: tokens.radius,
            paddingVertical: tokens.paddingY,
            paddingHorizontal: tokens.paddingX,
            textAlignVertical: 'top',
            overflow: 'hidden',
        }),
        feedback: (tokens) => ({
            fontFamily: tokens.fontFamily,
            fontSize: tokens.feedbackFontSize,
            color: tokens.feedbackColor,
            marginTop: tokens.gap,
            paddingRight: tokens.paddingX,
        }),
    },
    transition: { transitionProperty: 'all', transitionDuration: 150 },
});
