import type { ReactNode } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ResolvedComponentTokens } from '../../../../providers-and-hooks';
import { useSlotContext } from '../context';
import type { BottomSheetStyleDefinition } from '../types';

export type BottomSheetContentRenderProps = {
    tokens: ResolvedComponentTokens<BottomSheetStyleDefinition>;
    /** The merged content style; the render output replaces the slot. */
    style: StyleProp<ViewStyle>;
};

export type BottomSheetContentProps = Omit<ViewProps, 'children'> & {
    children?:
        ReactNode | ((props: BottomSheetContentRenderProps) => ReactNode);
};

export function BottomSheetContent({
    children,
    style,
    ...props
}: BottomSheetContentProps) {
    const { styles, tokens } = useSlotContext('BottomSheet.Content');

    if (typeof children === 'function') {
        return <>{children({ tokens, style: [styles.content, style] })}</>;
    }

    return (
        <Animated.View {...props} style={[styles.content, style]}>
            {children}
        </Animated.View>
    );
}
