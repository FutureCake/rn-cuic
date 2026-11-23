import { StyleSheet } from 'react-native';
import Animated, { Easing, withTiming } from 'react-native-reanimated';
import { AnimatedPressable } from '../../../shared/libs/reanimated';
import { ANIMATION_DURATION, ENTER_TRANSLATE_Y } from './constants';
import type { ModalBuilderOptions, ModalProps } from './types';

/** Structural only; visuals belong to the slot styles. */
const structural = StyleSheet.create({
    backdrop: { ...StyleSheet.absoluteFill },
    // Centers the card; touches outside the card fall through to the
    // overlay pressable behind it.
    wrapper: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'box-none',
    },
});

const timingIn = {
    duration: ANIMATION_DURATION,
    easing: Easing.out(Easing.cubic),
};
const timingOut = {
    duration: ANIMATION_DURATION,
    easing: Easing.in(Easing.cubic),
};

/** Fade in while sliding up from below; reversed automatically on unmount. */
const cardEntering = () => {
    'worklet';
    return {
        initialValues: {
            opacity: 0,
            transform: [{ translateY: ENTER_TRANSLATE_Y }],
        },
        animations: {
            opacity: withTiming(1, timingIn),
            transform: [{ translateY: withTiming(0, timingIn) }],
        },
    };
};

const cardExiting = () => {
    'worklet';
    return {
        initialValues: {
            opacity: 1,
            transform: [{ translateY: 0 }],
        },
        animations: {
            opacity: withTiming(0, timingOut),
            transform: [
                { translateY: withTiming(ENTER_TRANSLATE_Y, timingOut) },
            ],
        },
    };
};

/**
 * Bind shared behavior to the configured style hooks. The modal is
 * mount-controlled: it fades/slides in on mount and plays the reverse exit
 * animation automatically when unmounted. `onClose` (fired by the outside
 * press) only asks the parent to unmount it.
 */
export function createModal<Theme extends string>({
    useStyles,
    useTheme,
}: ModalBuilderOptions<Theme>) {
    return function Modal({
        onClose,
        closeOnPressOutside = true,
        backdrop = true,
        minWidth,
        maxWidth,
        minHorizontalSpacing,
        children,
        theme: themeProp,
        style,
        styleOverrides,
        ...props
    }: ModalProps<Theme>) {
        const { theme: ambientTheme } = useTheme();
        const theme = themeProp ?? ambientTheme;
        const { styles, tokens } = useStyles({
            influences: { theme },
            overrides: {
                ...styleOverrides,
                // Sizing props beat the token-driven slot values but stay
                // below the styleOverrides/style escape hatches. Only set
                // keys are included so an absent prop can't erase a token.
                card: [
                    minWidth !== undefined && { minWidth },
                    maxWidth !== undefined && { maxWidth },
                    styleOverrides?.card,
                    style,
                ],
            },
        });
        const { marginX, backdropOpacity } = tokens;

        const outsideCloses = closeOnPressOutside && onClose !== undefined;
        const showOverlay = backdrop || outsideCloses;

        // The scrim rests at the token opacity; entering/exiting fade it.
        const backdropEntering = () => {
            'worklet';
            return {
                initialValues: { opacity: 0 },
                animations: {
                    opacity: withTiming(backdropOpacity, timingIn),
                },
            };
        };
        const backdropExiting = () => {
            'worklet';
            return {
                initialValues: { opacity: backdropOpacity },
                animations: { opacity: withTiming(0, timingOut) },
            };
        };

        return (
            <>
                {showOverlay && (
                    <AnimatedPressable
                        accessibilityRole={outsideCloses ? 'button' : undefined}
                        accessibilityLabel={outsideCloses ? 'Close' : undefined}
                        onPress={outsideCloses ? onClose : undefined}
                        entering={backdrop ? backdropEntering : undefined}
                        exiting={backdrop ? backdropExiting : undefined}
                        style={[
                            structural.backdrop,
                            backdrop && styles.backdrop,
                            backdrop && { opacity: backdropOpacity },
                        ]}
                    />
                )}
                <Animated.View
                    style={[
                        structural.wrapper,
                        {
                            paddingHorizontal: minHorizontalSpacing ?? marginX,
                        },
                    ]}
                >
                    <Animated.View
                        accessibilityViewIsModal={showOverlay}
                        entering={cardEntering}
                        exiting={cardExiting}
                        {...props}
                        style={styles.card}
                    >
                        {children}
                    </Animated.View>
                </Animated.View>
            </>
        );
    };
}
