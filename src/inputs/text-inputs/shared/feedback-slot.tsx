import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';

/**
 * Shared Feedback slot body. Each component keeps its own exported slot (its
 * identity drives hasSlot) and resolves context; this renders the result.
 */
export type SharedFeedbackSlotProps<Tokens> = Omit<TextProps, 'children'> & {
    tokens: Tokens;
    slotStyle: StyleProp<TextStyle>;
    /** Active (invalid, visible) validation message, if any. */
    validationMessage: string | undefined;
    /** Invalid validation message, else the `feedback` prop. */
    message: string | undefined;
    variant: string;
    /**
     * Static content is replaced by an active validation message; a render
     * function receives the resolved feedback and decides itself.
     */
    children?:
        | ReactNode
        | ((props: {
              message: string | undefined;
              variant: string;
              tokens: Tokens;
              style: StyleProp<TextStyle>;
          }) => ReactNode);
};

export function SharedFeedbackSlot<Tokens>({
    tokens,
    slotStyle,
    validationMessage,
    message,
    variant,
    children,
    style,
    ...props
}: SharedFeedbackSlotProps<Tokens>) {
    if (typeof children === 'function') {
        return (
            <>
                {children({
                    message,
                    variant,
                    tokens,
                    style: [slotStyle, style],
                })}
            </>
        );
    }

    const content = validationMessage ?? children ?? message;
    if (content === undefined || content === null || content === '') {
        return null;
    }
    return (
        <Animated.Text {...props} style={[slotStyle, style]}>
            {content}
        </Animated.Text>
    );
}
