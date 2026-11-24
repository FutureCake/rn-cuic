import type { ReactNode } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { View } from 'react-native';

/** Uniform padding on all sides, or split horizontal (`x`) / vertical (`y`). */
export type StackPadding = number | { x?: number; y?: number };

export type StackProps = Omit<ViewProps, 'style' | 'children'> & {
    /** Gap between children. */
    spacing?: number;
    /** Inner padding: a number for all sides, or `{ x, y }`. */
    padding?: StackPadding;
    /** Cross-axis alignment of children (`alignItems`). */
    align?: ViewStyle['alignItems'];
    /** Main-axis distribution of children (`justifyContent`). */
    justify?: ViewStyle['justifyContent'];
    /** Stack direction: row or column. */
    direction: ViewStyle['flexDirection'];
    /** Extra styles merged after the stack's own layout styles. */
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
};

/**
 * Shared body for the stack layout primitives. Internal — consumers use
 * `VStack`/`HStack`, which bind `direction`.
 */
export function Stack({
    direction,
    spacing,
    padding,
    align,
    justify,
    style,
    children,
    ...viewProps
}: StackProps) {
    const paddingStyle =
        typeof padding === 'number'
            ? { padding }
            : padding && {
                  paddingHorizontal: padding.x,
                  paddingVertical: padding.y,
              };

    return (
        <View
            {...viewProps}
            style={[
                {
                    flexDirection: direction,
                    gap: spacing,
                    alignItems: align,
                    justifyContent: justify,
                },
                paddingStyle,
                style,
            ]}
        >
            {children}
        </View>
    );
}
