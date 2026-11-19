import type { ReactNode } from 'react';
import type {
    GestureResponderEvent,
    LayoutChangeEvent,
    PressableProps,
    StyleProp,
    ViewStyle,
} from 'react-native';
import type { ResolvedComponentTokens } from '../../../providers-and-hooks';
import { AnimatedPressable } from '../../../shared/libs/reanimated';
import { useSlotContext } from '../context';
import type { BottomSheetStyleDefinition } from '../types';

export type BottomSheetMinimizedRenderProps = {
    tokens: ResolvedComponentTokens<BottomSheetStyleDefinition>;
    /** The merged minimized style; the render output replaces the slot. */
    style: StyleProp<ViewStyle>;
};

export type BottomSheetMinimizedProps = Omit<
    PressableProps,
    'children' | 'style'
> & {
    style?: StyleProp<ViewStyle>;
    /**
     * A render function replaces the measuring pressable, so the minimized
     * height can no longer be derived and tap-to-expand is lost — pair it
     * with the root's `initialHeight` and your own press handling.
     */
    children?:
        ReactNode | ((props: BottomSheetMinimizedRenderProps) => ReactNode);
};

/**
 * Content that stays visible while the sheet is minimized. The root derives
 * the minimized height from this slot's layout and tapping it expands the
 * sheet. Must be a direct child of BottomSheet.
 */
export function BottomSheetMinimized({
    children,
    style,
    onLayout,
    onPress,
    ...props
}: BottomSheetMinimizedProps) {
    const { styles, tokens, onMinimizedLayout, onMinimizedPress } =
        useSlotContext('BottomSheet.Minimized');

    if (typeof children === 'function') {
        return <>{children({ tokens, style: [styles.minimized, style] })}</>;
    }

    const handleLayout = (event: LayoutChangeEvent) => {
        const { y, height } = event.nativeEvent.layout;
        onMinimizedLayout(y + height);
        onLayout?.(event);
    };

    const handlePress = (event: GestureResponderEvent) => {
        onMinimizedPress();
        onPress?.(event);
    };

    return (
        <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel="Expand"
            {...props}
            onPress={handlePress}
            onLayout={handleLayout}
            style={[styles.minimized, style]}
        >
            {children}
        </AnimatedPressable>
    );
}
