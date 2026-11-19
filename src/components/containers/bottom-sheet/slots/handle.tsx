import type { ReactNode } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ResolvedComponentTokens } from '../../../../providers-and-hooks';
import { useSlotContext } from '../context';
import type { BottomSheetStyleDefinition } from '../types';

export type BottomSheetHandleRenderProps = {
    tokens: ResolvedComponentTokens<BottomSheetStyleDefinition>;
    /** The merged handleWrapper style; the render output replaces the slot. */
    style: StyleProp<ViewStyle>;
};

export type BottomSheetHandleProps = Omit<ViewProps, 'children'> & {
    /**
     * ReactNode children replace the default grab bar inside the wrapper;
     * a render function replaces the entire slot.
     */
    children?: ReactNode | ((props: BottomSheetHandleRenderProps) => ReactNode);
};

export function BottomSheetHandle({
    children,
    style,
    ...props
}: BottomSheetHandleProps) {
    const { styles, tokens } = useSlotContext('BottomSheet.Handle');

    if (typeof children === 'function') {
        return (
            <>{children({ tokens, style: [styles.handleWrapper, style] })}</>
        );
    }

    return (
        <Animated.View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            {...props}
            style={[styles.handleWrapper, style]}
        >
            {children ?? <Animated.View style={styles.handle} />}
        </Animated.View>
    );
}
