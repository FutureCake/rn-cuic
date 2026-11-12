import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import type { ResolvedComponentTokens } from '../../../../providers-and-hooks';
import { SharedFeedbackSlot } from '../../shared/feedback-slot';
import { useSlotContext } from '../context';
import type { TextFieldStyleDefinition } from '../types';

export type TextFieldFeedbackRenderProps = {
    /** Invalid validation message, else the `feedback` prop. */
    message: string | undefined;
    variant: string;
    tokens: ResolvedComponentTokens<TextFieldStyleDefinition>;
    style: StyleProp<TextStyle>;
};

export type TextFieldFeedbackProps = Omit<TextProps, 'children'> & {
    /**
     * Static content is replaced by an active validation message; a render
     * function receives the resolved feedback and decides itself.
     */
    children?: ReactNode | ((props: TextFieldFeedbackRenderProps) => ReactNode);
};

export function TextFieldFeedback(props: TextFieldFeedbackProps) {
    const { styles, tokens, validationMessage, message, variant } =
        useSlotContext('TextField.Feedback');
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
