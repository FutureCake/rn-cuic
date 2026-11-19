import { StyleSheet, type LayoutChangeEvent } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { AnimatedPressable } from '../../shared/libs/reanimated';
import { ContextProvider } from './context';
import { useBottomSheetAnimation } from './hooks/use-bottom-sheet-animation';
import { useBottomSheetSlots } from './hooks/use-bottom-sheet-slots';
import { BottomSheetContent } from './slots/content';
import { BottomSheetHandle } from './slots/handle';
import { BottomSheetMinimized } from './slots/minimized';
import type { BottomSheetBuilderOptions, BottomSheetProps } from './types';

/** Structural only; visuals belong to the slot styles. */
const structural = StyleSheet.create({
    backdrop: { ...StyleSheet.absoluteFill },
    // Bottom-anchored clipping window: the animated height reveals the top
    // portion of the body and nothing can overflow the sheet's bounds.
    // Slot styles may lift or inset it with bottom/left/right offsets.
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    // Absolute so the animated container height never re-flows the content
    // while animating; measured whole for the expanded height.
    body: { position: 'absolute', top: 0, left: 0, right: 0 },
});

/**
 * Bind shared behavior to the configured style hooks. The sheet is
 * mount-controlled: it springs in on mount (to the minimized snap when one
 * exists, else fully open), is dismissed by gesture or outside press when
 * allowed, and reports dismissal through `onClose`.
 */
export function createBottomSheet<Theme extends string>({
    useStyles,
    useTheme,
}: BottomSheetBuilderOptions<Theme>) {
    function BottomSheetRoot({
        onClose,
        closeOnPressOutside = true,
        backdrop = false,
        initialHeight,
        maxHeight,
        minimizedClosable = false,
        showHandleOnMinimized = false,
        onExpandedChange,
        children,
        theme: themeProp,
        style,
        styleOverrides,
        onLayout,
        ...props
    }: BottomSheetProps<Theme>) {
        const { theme: ambientTheme } = useTheme();
        const theme = themeProp ?? ambientTheme;
        const { styles, tokens } = useStyles({
            influences: { theme },
            overrides: {
                ...styleOverrides,
                sheet: [styleOverrides?.sheet, style],
            },
        });
        const { topSafeArea, bottomSafeArea, backdropOpacity } = tokens;

        // Children are slot elements only; each slot is a singleton. The
        // fixed render order (handle → minimized → content) also keeps the
        // Minimized slot a direct body child so its layout can be measured.
        const { handleSlot, minimizedSlot, contentSlot } =
            useBottomSheetSlots(children);

        const hasMinimized = minimizedSlot !== undefined;
        // A minimized sheet without `minimizedClosable` is persistent: the
        // user cannot dismiss it and the screen behind stays interactive.
        const persistent = hasMinimized && !minimizedClosable;
        const closeAllowed = onClose !== undefined && !persistent;
        const outsideCloses = closeOnPressOutside && closeAllowed;
        const showOverlay = (backdrop && !persistent) || outsideCloses;
        // The handle doubles as the swipe-up affordance; a minimized sheet
        // hides it (tap to expand) unless opted in or explicitly composed.
        const showHandle =
            !hasMinimized || showHandleOnMinimized || handleSlot !== undefined;
        if (__DEV__ && backdrop && persistent) {
            console.warn(
                'BottomSheet: `backdrop` is ignored while the sheet is persistent (Minimized slot without `minimizedClosable`).'
            );
        }
        if (__DEV__ && minimizedClosable && onClose === undefined) {
            console.warn(
                'BottomSheet: `minimizedClosable` needs `onClose` to actually close the sheet.'
            );
        }

        const {
            pan,
            sheetAnimatedStyle,
            backdropAnimatedStyle,
            onBodyLayout,
            onMinimizedLayout,
            onMinimizedPress,
            onOutsidePress,
        } = useBottomSheetAnimation({
            initialHeight,
            maxHeight,
            topSafeArea,
            backdropOpacity,
            showHandle,
            closeAllowed,
            onClose,
            onExpandedChange,
        });

        const handleBodyLayout = (event: LayoutChangeEvent) => {
            onBodyLayout(event);
            onLayout?.(event);
        };

        return (
            <ContextProvider
                value={{ styles, tokens, onMinimizedLayout, onMinimizedPress }}
            >
                {showOverlay && (
                    <AnimatedPressable
                        accessibilityRole={outsideCloses ? 'button' : undefined}
                        accessibilityLabel={outsideCloses ? 'Close' : undefined}
                        onPress={outsideCloses ? onOutsidePress : undefined}
                        style={[
                            structural.backdrop,
                            backdrop && styles.backdrop,
                            backdrop && backdropAnimatedStyle,
                        ]}
                    />
                )}
                <GestureDetector gesture={pan}>
                    <Animated.View
                        accessibilityViewIsModal={showOverlay}
                        {...props}
                        style={[
                            structural.sheet,
                            styles.sheet,
                            sheetAnimatedStyle,
                        ]}
                    >
                        <Animated.View
                            onLayout={handleBodyLayout}
                            style={[
                                structural.body,
                                { paddingBottom: bottomSafeArea },
                            ]}
                        >
                            {showHandle &&
                                (handleSlot ?? <BottomSheetHandle />)}
                            {minimizedSlot}
                            {contentSlot}
                        </Animated.View>
                    </Animated.View>
                </GestureDetector>
            </ContextProvider>
        );
    }

    return Object.assign(BottomSheetRoot, {
        Handle: BottomSheetHandle,
        Minimized: BottomSheetMinimized,
        Content: BottomSheetContent,
    });
}
