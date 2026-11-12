import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import type { ResolvedComponentTokens } from '../../../../providers-and-hooks';
import { SharedHeaderSlot } from '../../shared/header-slot';
import { useSlotContext } from '../context';
import type { TextAreaStyleDefinition } from '../types';

export type TextAreaHeaderRenderProps = {
    tokens: ResolvedComponentTokens<TextAreaStyleDefinition>;
    style: StyleProp<TextStyle>;
};

export type TextAreaHeaderProps = Omit<TextProps, 'children'> & {
    /** A render function receives the resolved tokens and slot style. */
    children?: ReactNode | ((props: TextAreaHeaderRenderProps) => ReactNode);
};

export function TextAreaHeader(props: TextAreaHeaderProps) {
    const { styles, tokens } = useSlotContext('TextArea.Header');
    return (
        <SharedHeaderSlot
            {...props}
            tokens={tokens}
            slotStyle={styles.header}
        />
    );
}
