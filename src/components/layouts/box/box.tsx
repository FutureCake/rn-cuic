import type { ReactNode } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { View } from 'react-native';

/**
 * Padding as a number for all sides, or an object combining axes (`x`, `y`)
 * and individual sides (`top`, `right`, `bottom`, `left`). A side wins over
 * its axis, so `{ x: 16, left: 4 }` gives left 4 and right 16.
 */
export type BoxPadding =
    | number
    | {
          x?: number;
          y?: number;
          top?: number;
          right?: number;
          bottom?: number;
          left?: number;
      };

export type BoxProps = Omit<ViewProps, 'style' | 'children'> & {
    /** Inner padding: a number for all sides, or any mix of `x`/`y`/sides. */
    padding?: BoxPadding;
    /** Extra styles merged after the box's own padding. */
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
};

function resolvePadding(
    padding: BoxPadding | undefined
): ViewStyle | undefined {
    if (padding === undefined) return undefined;
    if (typeof padding === 'number') return { padding };

    // Side-specific keys take precedence over axis keys in RN, so the
    // "side wins over axis" rule needs no manual merging.
    return {
        paddingHorizontal: padding.x,
        paddingVertical: padding.y,
        paddingTop: padding.top,
        paddingRight: padding.right,
        paddingBottom: padding.bottom,
        paddingLeft: padding.left,
    };
}

/** Plain container that applies padding around its children. */
export function Box({ padding, style, children, ...viewProps }: BoxProps) {
    return (
        <View {...viewProps} style={[resolvePadding(padding), style]}>
            {children}
        </View>
    );
}
