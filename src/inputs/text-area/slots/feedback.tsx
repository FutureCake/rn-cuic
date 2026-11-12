import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ResolvedComponentTokens } from '../../../providers-and-hooks';
import { useSlotContext } from '../context';
import type { TextAreaStyleDefinition } from '../types';

export type TextAreaFeedbackRenderProps = {
    /** Invalid validation message, else the `feedback` prop. */
    message: string | undefined;
    variant: string;
    tokens: ResolvedComponentTokens<TextAreaStyleDefinition>;
    style: StyleProp<TextStyle>;
};

export type TextAreaFeedbackProps = Omit<TextProps, 'children'> & {
    /**
     * Static content is replaced by an active validation message; a render
     * function receives the resolved feedback and decides itself.
     */
    children?: ReactNode | ((props: TextAreaFeedbackRenderProps) => ReactNode);
};

export function TextAreaFeedback({
    children,
    style,
    ...props
}: TextAreaFeedbackProps) {
    const { styles, tokens, validationMessage, message, variant } =
        useSlotContext('TextArea.Feedback');

    if (typeof children === 'function') {
        return (
            <>
                {children({
                    message,
                    variant,
                    tokens,
                    style: [styles.feedback, style],
                })}
            </>
        );
    }

    const content = validationMessage ?? children ?? message;
    if (content === undefined || content === null || content === '') {
        return null;
    }
    return (
        <Animated.Text {...props} style={[styles.feedback, style]}>
            {content}
        </Animated.Text>
    );
}
