import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import type { ResolvedComponentTokens } from '../../../../providers-and-hooks';
import { SharedFeedbackSlot } from '../../shared/feedback-slot';
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

export function TextAreaFeedback(props: TextAreaFeedbackProps) {
    const { styles, tokens, validationMessage, message, variant } =
        useSlotContext('TextArea.Feedback');
    return (
        <SharedFeedbackSlot
            {...props}
            tokens={tokens}
            slotStyle={styles.feedback}
            validationMessage={validationMessage}
            message={message}
            variant={variant}
        />
    );
}
