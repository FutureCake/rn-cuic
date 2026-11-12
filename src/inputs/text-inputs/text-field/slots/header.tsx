import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import type { ResolvedComponentTokens } from '../../../../providers-and-hooks';
import { SharedHeaderSlot } from '../../shared/header-slot';
import { useSlotContext } from '../context';
import type { TextFieldStyleDefinition } from '../types';

export type TextFieldHeaderRenderProps = {
    tokens: ResolvedComponentTokens<TextFieldStyleDefinition>;
    style: StyleProp<TextStyle>;
};

export type TextFieldHeaderProps = Omit<TextProps, 'children'> & {
    /** A render function receives the resolved tokens and slot style. */
    children?: ReactNode | ((props: TextFieldHeaderRenderProps) => ReactNode);
};

export function TextFieldHeader(props: TextFieldHeaderProps) {
    const { styles, tokens } = useSlotContext('TextField.Header');
    return (
        <SharedHeaderSlot
            {...props}
            tokens={tokens}
            slotStyle={styles.header}
        />
    );
}
