import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import type { ResolvedComponentTokens } from '../../../../providers-and-hooks';
import { SharedHeaderSlot } from '../../text-inputs/shared/header-slot';
import { useSlotContext } from '../context';
import type { ChipsStyleDefinition } from '../types';

export type ChipsHeaderRenderProps = {
    tokens: ResolvedComponentTokens<ChipsStyleDefinition>;
    style: StyleProp<TextStyle>;
};

export type ChipsHeaderProps = Omit<TextProps, 'children'> & {
    /** A render function receives the resolved tokens and slot style. */
    children?: ReactNode | ((props: ChipsHeaderRenderProps) => ReactNode);
};

export function ChipsHeader(props: ChipsHeaderProps) {
    const { styles, tokens } = useSlotContext('Chips.Header');
    return (
        <SharedHeaderSlot
            {...props}
            tokens={tokens}
            slotStyle={styles.header}
        />
    );
}
