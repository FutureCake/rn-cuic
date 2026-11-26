import {
    colors,
    fontSizes,
    radii,
    spacings,
} from '../../../pre-cooked/amitges/style-consts';
import { defineButtonStyles } from './define-styles';

/**
 * Default preset: a complete, usable button out of the box.
 * Every size supplies its full scale; fonts default to the platform system font.
 */
export const buttonStyleDefinition = defineButtonStyles({
    defaultTokens: {
        alignSelf: 'auto',
        justifyContent: 'center',
        fontSize: 17,
        font: 'body',
        fontWeight: 400,
        paddingX: 16,
        paddingY: 10,
        iconGap: 8,
        iconSize: 20,
        radius: 8,
        textColor: colors.gray_1000,
        bgColor: colors.gray_900,
        // Every variant reserves the border so solid, outline and ghost share a footprint.
        borderColor: 'transparent',
        borderWidth: 1,
        scale: 1,
    },
    influenceResolvers: {
        theme: {
            light: {
                bgColor: colors.gray_000,
                textColor: colors.gray_1000,
            },
            dark: {
                bgColor: colors.gray_1000,
                textColor: colors.gray_000,
            },
        },
        size: {
            s: {
                paddingX: spacings.s16,
                paddingY: spacings.s8,
                fontSize: fontSizes.s,
                fontWeight: 500,
                iconSize: fontSizes.s,
                iconGap: spacings.s4,
                radius: radii.m,
            },
            m: {
                paddingX: spacings.s24,
                paddingY: spacings.s12,
                fontSize: fontSizes.m,
                fontWeight: 500,
                iconSize: fontSizes.m,
                iconGap: spacings.s4,
                radius: radii.m,
            },
            l: {
                paddingX: spacings.s28,
                paddingY: spacings.s16,
                fontSize: fontSizes.l,
                fontWeight: 500,
                iconSize: fontSizes.l,
                iconGap: spacings.s8,
                radius: radii.m,
            },
            xl: ({ shape }) => ({
                paddingX: shape === 'hug' ? spacings.s8 : spacings.s40,
                paddingY: shape === 'hug' ? spacings.s8 : spacings.s20,
                borderWidth: 2,
                fontSize: fontSizes.xxl,
                fontWeight: 600,
                iconSize: fontSizes.xxl,
                iconGap: spacings.s12,
                radius: radii.m,
            }),
        },
        shape: {
            block: { alignSelf: 'stretch' },
            hug: { alignSelf: 'flex-start' },
            pill: {
                alignSelf: 'flex-start',
                radius: 9999,
            },
        },
        variant: {
            solid: {},
            outline: ({ theme }) => ({
                bgColor: 'transparent',
                borderColor:
                    theme === 'light' ? colors.gray_000 : colors.gray_1000,
                textColor:
                    theme === 'light' ? colors.gray_000 : colors.gray_1000,
            }),
            ghost: ({ theme }) => ({
                bgColor: 'transparent',
                textColor:
                    theme === 'light' ? colors.gray_000 : colors.gray_1000,
            }),
            text: ({ theme }) => ({
                paddingX: 0,
                paddingY: 0,
                radius: 0,
                borderWidth: 0,
                alignSelf: 'flex-start',
                justifyContent: 'flex-start',
                bgColor: 'transparent',
                textColor:
                    theme === 'light' ? colors.gray_000 : colors.gray_1000,
            }),
        },
    },
    stateResolvers: {
        pressed: {
            scale: 1.02,
        },
        disabled: ({ theme, variant }) => {
            const solidVariant =
                variant === 'solid'
                    ? {
                          bgColor:
                              theme === 'light'
                                  ? colors.gray_800
                                  : colors.gray_300,
                          textColor:
                              theme === 'light'
                                  ? colors.gray_1000
                                  : colors.gray_500,
                      }
                    : {};

            const disabledTextColor =
                theme === 'light' ? colors.gray_700 : colors.gray_400;
            const outlineVariant =
                variant === 'outline'
                    ? {
                          borderColor: disabledTextColor,
                      }
                    : {};

            return {
                textColor: disabledTextColor,
                ...solidVariant,
                ...outlineVariant,
            };
        },
    },
    slotStyles: {
        container: (tokens) => ({
            paddingHorizontal: tokens.paddingX,
            paddingVertical: tokens.paddingY,
            borderRadius: tokens.radius,
            backgroundColor: tokens.bgColor,
            borderColor: tokens.borderColor,
            borderWidth: tokens.borderWidth,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: tokens.justifyContent,
            alignSelf: tokens.alignSelf,
            gap: tokens.iconGap,
            transform: [{ scale: tokens.scale }],
        }),
        text: (tokens, { font }) => ({
            ...font(tokens.font, tokens.fontWeight),
            fontSize: tokens.fontSize,
            color: tokens.textColor,
        }),
        icon: (tokens) => ({
            tintColor: tokens.textColor,
            width: tokens.iconSize,
            height: tokens.iconSize,
            resizeMode: 'contain',
        }),
    },
    transition: { transitionProperty: 'all', transitionDuration: 499 },
});
