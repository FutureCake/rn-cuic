import {
    Keyboard,
    useWindowDimensions,
    type LayoutChangeEvent,
} from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import {
    Extrapolation,
    interpolate,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
    DISMISS_DURATION,
    SNAP_THRESHOLD,
    SPRING_CONFIG,
    VELOCITY_THRESHOLD,
} from '../constants';

export type BottomSheetAnimationOptions = {
    /** Minimum minimized height; the measured Minimized slot wins when larger. */
    initialHeight?: number;
    /** Caps the expanded height (still clamped to the screen/keyboard). */
    maxHeight?: number;
    /** Gap kept between the screen top and the fully expanded sheet. */
    topSafeArea: number;
    /** Backdrop opacity when fully open; fades with the sheet height. */
    backdropOpacity: number;
    /** Whether the handle (the swipe-up affordance) is rendered. */
    showHandle: boolean;
    /** Whether gestures and the outside press may dismiss the sheet. */
    closeAllowed: boolean;
    onClose?: () => void;
    onExpandedChange?: (expanded: boolean) => void;
};

/**
 * The sheet's animation engine: owns the animated sheet height (the single
 * driver of what is visible, 0 = hidden), its snap points (expanded,
 * minimized, closed) and everything that moves between them — mount-in
 * spring, pan gesture, tap-to-expand, outside press and keyboard avoidance.
 */
export function useBottomSheetAnimation({
    initialHeight,
    maxHeight,
    topSafeArea,
    backdropOpacity,
    showHandle,
    closeAllowed,
    onClose,
    onExpandedChange,
}: BottomSheetAnimationOptions) {
    const { height: screenHeight } = useWindowDimensions();
    // Negative while the keyboard is open (0 → -keyboardHeight).
    const keyboard = useReanimatedKeyboardAnimation();
    const bodyHeight = useSharedValue(0);
    const minimizedBottom = useSharedValue(0);
    const isExpanded = useSharedValue(false);
    const isDragging = useSharedValue(false);
    const startHeight = useSharedValue(0);
    // The sheet is bottom-anchored and clips: this animated height is the
    // single driver of what is visible (0 = fully hidden).
    const sheetHeight = useSharedValue(0);

    const expandedHeight = useDerivedValue(() => {
        const availableHeight =
            screenHeight + keyboard.height.value - topSafeArea;
        const cap =
            maxHeight === undefined
                ? availableHeight
                : Math.min(maxHeight, availableHeight);
        return Math.min(bodyHeight.value, cap);
    });

    // The minimized sheet clips exactly at the Minimized slot's bottom edge
    // so nothing below it shows; initialHeight acts as a floor and only wins
    // when larger than the measured slot. Without either, the minimized
    // height equals the expanded height and the sheet has no minimized snap.
    const minimizedHeight = useDerivedValue(() => {
        const min = Math.max(minimizedBottom.value, initialHeight ?? 0);
        if (min <= 0) return expandedHeight.value;
        return Math.min(min, expandedHeight.value);
    });

    const restingHeight = useDerivedValue(() => {
        if (expandedHeight.value === 0) return 0;
        return isExpanded.value ? expandedHeight.value : minimizedHeight.value;
    });

    // Spring to the resting height whenever it changes on the UI thread:
    // mount-in (first layout), keyboard and content changes.
    useAnimatedReaction(
        () => restingHeight.value,
        (target) => {
            if (isDragging.value) return;
            sheetHeight.value = withSpring(target, SPRING_CONFIG);
        }
    );

    const notifyClose = () => onClose?.();

    const pan = Gesture.Pan()
        .onBegin(() => {
            isDragging.value = true;
        })
        .onStart(() => {
            startHeight.value = sheetHeight.value;
        })
        .onUpdate((event) => {
            const expanded = expandedHeight.value;
            const minimized = minimizedHeight.value;
            // Swipe-up reveal needs the handle; from the minimized state
            // without one the sheet only moves down.
            const upper = showHandle || isExpanded.value ? expanded : minimized;
            const lower = closeAllowed ? 0 : Math.min(minimized, expanded);
            sheetHeight.value = Math.min(
                upper,
                Math.max(lower, startHeight.value - event.translationY)
            );
        })
        .onEnd((event) => {
            const expanded = expandedHeight.value;
            const minimized = minimizedHeight.value;
            const collapsible = minimized < expanded - 1;

            // Snap heights, tallest first.
            const snaps: number[] = [];
            if (showHandle || isExpanded.value || !collapsible) {
                snaps.push(expanded);
            }
            if (collapsible) snaps.push(minimized);
            if (closeAllowed) snaps.push(0);

            let index: number;
            if (event.velocityY > VELOCITY_THRESHOLD) {
                index = snaps.length - 1;
            } else if (event.velocityY < -VELOCITY_THRESHOLD) {
                index = 0;
            } else {
                // Start from the snap nearest the drag origin, then step in
                // the drag direction for every segment crossed past the
                // threshold fraction.
                index = 0;
                let best = Math.abs(startHeight.value - snaps[0]!);
                for (let i = 1; i < snaps.length; i++) {
                    const distance = Math.abs(startHeight.value - snaps[i]!);
                    if (distance < best) {
                        best = distance;
                        index = i;
                    }
                }
                while (
                    index < snaps.length - 1 &&
                    sheetHeight.value <
                        snaps[index]! -
                            (snaps[index]! - snaps[index + 1]!) * SNAP_THRESHOLD
                ) {
                    index++;
                }
                while (
                    index > 0 &&
                    sheetHeight.value >
                        snaps[index]! +
                            (snaps[index - 1]! - snaps[index]!) * SNAP_THRESHOLD
                ) {
                    index--;
                }
            }

            const target = snaps[index]!;
            if (target === 0) {
                sheetHeight.value = withTiming(
                    0,
                    { duration: DISMISS_DURATION },
                    () => scheduleOnRN(notifyClose)
                );
                return;
            }
            const expandedNow = target === expanded;
            if (
                collapsible &&
                expandedNow !== isExpanded.value &&
                onExpandedChange !== undefined
            ) {
                scheduleOnRN(onExpandedChange, expandedNow);
            }
            isExpanded.value = expandedNow;
            sheetHeight.value = withSpring(target, SPRING_CONFIG);
        })
        .onFinalize(() => {
            isDragging.value = false;
        });

    const onOutsidePress = () => {
        Keyboard.dismiss();
        sheetHeight.value = withTiming(0, { duration: DISMISS_DURATION }, () =>
            scheduleOnRN(notifyClose)
        );
    };

    const onMinimizedPress = () => {
        if (isExpanded.value) return;
        isExpanded.value = true;
        onExpandedChange?.(true);
    };

    const sheetAnimatedStyle = useAnimatedStyle(() => ({
        height: sheetHeight.value,
        // Rise with the keyboard (keyboard.height is negative while open);
        // the gap left below is covered by the keyboard itself.
        transform: [{ translateY: keyboard.height.value }],
    }));

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
        // Anchor on expandedHeight so the range is valid before layout
        // fires; while it is 0 the backdrop stays invisible.
        opacity:
            expandedHeight.value === 0
                ? 0
                : interpolate(
                      sheetHeight.value,
                      [0, expandedHeight.value],
                      [0, backdropOpacity],
                      Extrapolation.CLAMP
                  ),
    }));

    const onBodyLayout = (event: LayoutChangeEvent) => {
        bodyHeight.value = event.nativeEvent.layout.height;
    };

    const onMinimizedLayout = (bottom: number) => {
        minimizedBottom.value = bottom;
    };

    return {
        pan,
        sheetAnimatedStyle,
        backdropAnimatedStyle,
        onBodyLayout,
        onMinimizedLayout,
        onMinimizedPress,
        onOutsidePress,
    };
}
