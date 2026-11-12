import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';

/**
 * Shared Header slot body. Each component keeps its own exported slot (its
 * identity drives hasSlot) and resolves context; this renders the result.
 */
export type SharedHeaderSlotProps<Tokens> = Omit<TextProps, 'children'> & {
    tokens: Tokens;
    slotStyle: StyleProp<TextStyle>;
    /** A render function receives the resolved tokens and slot style. */
    children?:
        | ReactNode
        | ((props: {
              tokens: Tokens;
              style: StyleProp<TextStyle>;
          }) => ReactNode);
};

export function SharedHeaderSlot<Tokens>({
    tokens,
    slotStyle,
    children,
    style,
    ...props
}: SharedHeaderSlotProps<Tokens>) {
    if (typeof children === 'function') {
        return <>{children({ tokens, style: [slotStyle, style] })}</>;
    }

    return (
        <Animated.Text {...props} style={[slotStyle, style]}>
            {children}
        </Animated.Text>
    );
}
