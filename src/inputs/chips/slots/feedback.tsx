import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import type { ResolvedComponentTokens } from '../../../providers-and-hooks';
import { SharedFeedbackSlot } from '../../text-inputs/shared/feedback-slot';
import { useSlotContext } from '../context';
import type { ChipsStyleDefinition } from '../types';

export type ChipsFeedbackRenderProps = {
    /** Invalid validation message, else the `feedback` prop. */
    message: string | undefined;
    variant: string;
    tokens: ResolvedComponentTokens<ChipsStyleDefinition>;
    style: StyleProp<TextStyle>;
};

export type ChipsFeedbackProps = Omit<TextProps, 'children'> & {
    /**
     * Static content is replaced by an active validation message; a render
     * function receives the resolved feedback and decides itself.
     */
    children?: ReactNode | ((props: ChipsFeedbackRenderProps) => ReactNode);
};

export function ChipsFeedback(props: ChipsFeedbackProps) {
    const { styles, tokens, validationMessage, message, variant } =
        useSlotContext('Chips.Feedback');
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
