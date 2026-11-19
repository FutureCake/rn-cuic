import { defineBottomSheetStyles } from './define-styles';

const themeColors = {
    light: {
        backgroundColor: '#FFF',
        handleColor: '#ccc',
    },
    dark: {
        backgroundColor: '#1b1b1b',
        handleColor: '#505050',
    },
} as const;

/**
 * Default preset: a white (or dark) rounded sheet with a grab handle and a
 * black scrim. Position and dismissal are behavior, not styling — they live
 * in the component; the slots only describe how the parts look.
 */
export const bottomSheetStyleDefinition = defineBottomSheetStyles({
    defaultTokens: {
        topRadius: 18,
        handleWidth: 42,
        handleHeight: 5,
        backdropColor: '#000',
        backdropOpacity: 0.45,
        contentPaddingX: 16,
        contentPaddingBottom: 16,
        topSafeArea: 32,
        bottomSafeArea: 34,
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
        sheet: (tokens) => ({
            backgroundColor: tokens.backgroundColor,
            borderTopLeftRadius: tokens.topRadius,
            borderTopRightRadius: tokens.topRadius,
        }),
        handleWrapper: () => ({
            alignItems: 'center',
            paddingVertical: 12,
        }),
        handle: (tokens) => ({
            width: tokens.handleWidth,
            height: tokens.handleHeight,
            borderRadius: tokens.handleHeight / 2,
            backgroundColor: tokens.handleColor,
        }),
        minimized: (tokens) => ({
            paddingHorizontal: tokens.contentPaddingX,
            paddingBottom: tokens.contentPaddingBottom,
        }),
        content: (tokens) => ({
            paddingHorizontal: tokens.contentPaddingX,
            paddingBottom: tokens.contentPaddingBottom,
        }),
    },
});
