import { defineSwitchStyles } from './define-styles';

const themeColors = {
    light: {
        default: {
            bgColor: '#FFF',
            borderColor: '#000',
            indicatorColor: '#000',
            textColor: '#000',
            activeTextColor: '#FFF',
        },
        disabled: {
            bgColor: '#ddd',
            borderColor: '#ddd',
            indicatorColor: '#6f6f6f',
            textColor: '#6f6f6f',
            activeTextColor: '#ddd',
        },
    },
    dark: {
        default: {
            bgColor: '#000',
            borderColor: '#FFF',
            indicatorColor: '#FFF',
            textColor: '#FFF',
            activeTextColor: '#000',
        },
        disabled: {
            bgColor: '#505050',
            borderColor: '#505050',
            indicatorColor: '#adadad',
            textColor: '#adadad',
            activeTextColor: '#505050',
        },
    },
} as const;

/**
 * Default preset: a pill-shaped segmented switch. The indicator slides behind
 * the selected option; its position and size follow the options' layout, so
 * they are animated by the component, not by these styles.
 */
export const switchStyleDefinition = defineSwitchStyles({
    defaultTokens: {
        fontSize: 16,
        fontFamily: undefined,
        borderWidth: 2,
        radius: 30,
        padding: 2,
        optionPaddingX: 22,
        optionPaddingY: 10,
        ...themeColors.light.default,
    },
    influenceResolvers: {
        theme: {
            light: themeColors.light.default,
            dark: themeColors.dark.default,
        },
    },
    stateResolvers: {
        disabled: ({ theme }) => themeColors[theme].disabled,
    },
    slotStyles: {
        container: (tokens) => ({
            backgroundColor: tokens.bgColor,
            overflow: 'hidden',
            borderRadius: tokens.radius,
            alignSelf: 'flex-start',
            borderWidth: tokens.borderWidth,
            borderColor: tokens.borderColor,
            padding: tokens.padding,
        }),
        indicator: (tokens) => ({
            position: 'absolute',
            top: tokens.padding,
            height: '100%',
            borderRadius: tokens.radius,
            backgroundColor: tokens.indicatorColor,
        }),
        option: (tokens) => ({
            alignSelf: 'flex-start',
            overflow: 'hidden',
            alignItems: 'center',
            borderRadius: tokens.radius,
            paddingVertical: tokens.optionPaddingY,
            paddingHorizontal: tokens.optionPaddingX,
        }),
        optionText: (tokens) => ({
            fontFamily: tokens.fontFamily,
            fontSize: tokens.fontSize,
            color: tokens.textColor,
        }),
    },
    transition: {
        transitionProperty: 'backgroundColor',
        transitionDuration: 150,
    },
});
