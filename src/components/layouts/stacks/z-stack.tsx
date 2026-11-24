import { Children } from 'react';
import { View } from 'react-native';
import type { StackProps } from './shared';
import { Stack } from './shared';

/** Shift per layer: a number for both axes, or split `{ x, y }`. */
export type ZStackOffset = number | { x?: number; y?: number };

export type ZStackProps = Omit<StackProps, 'direction' | 'spacing'> & {
    /**
     * Shift applied to each layer relative to the one below it. Negative
     * values fan the pile out to the left / upwards. Defaults to `0`
     * (layers stacked exactly on top of each other).
     */
    offset?: ZStackOffset;
};

/**
 * Layers children on top of each other (last child on top), each shifted by
 * `offset` relative to the previous one. The first child sizes the stack
 * (plus room for the total offset), so the layers are assumed to share its
 * size; larger later layers overflow. `align`/`justify` place every layer
 * the same way, so the pile moves as a whole.
 */
export function ZStack({
    offset = 0,
    padding = 0,
    style,
    children,
    ...stackProps
}: ZStackProps) {
    const x = typeof offset === 'number' ? offset : (offset.x ?? 0);
    const y = typeof offset === 'number' ? offset : (offset.y ?? 0);
    const px = typeof padding === 'number' ? padding : (padding.x ?? 0);
    const py = typeof padding === 'number' ? padding : (padding.y ?? 0);
    const layers = Children.toArray(children);
    const steps = Math.max(layers.length - 1, 0);

    // Reserve room for the fanned-out layers on the side they fan towards,
    // on top of the user's padding.
    const paddingStyle = {
        paddingLeft: px + (x < 0 ? steps * -x : 0),
        paddingRight: px + (x > 0 ? steps * x : 0),
        paddingTop: py + (y < 0 ? steps * -y : 0),
        paddingBottom: py + (y > 0 ? steps * y : 0),
    };

    return (
        <Stack {...stackProps} direction="column" style={[paddingStyle, style]}>
            {layers.map((layer, index) => (
                // Absolute without insets: each layer sits where the first
                // one does (respecting align/justify), then is shifted.
                <View
                    key={index}
                    style={[
                        index > 0 && { position: 'absolute' },
                        {
                            transform: [
                                { translateX: index * x },
                                { translateY: index * y },
                            ],
                        },
                    ]}
                >
                    {layer}
                </View>
            ))}
        </Stack>
    );
}
