import type { ResolvedComponentResult } from '../../providers-and-hooks';
import { createSlotContext } from '../../shared';
import type { ChipsStyleDefinition } from './types';

/** Fixed Chips tokens/slots: parts can share the default-generic contract. */
type ChipsContextValue = ResolvedComponentResult<ChipsStyleDefinition> & {
    /** Active (invalid, visible) validation message, if any. */
    validationMessage: string | undefined;
    message: string | undefined;
    variant: string;
};

export const { ContextProvider, useSlotContext } =
    createSlotContext<ChipsContextValue>('Chips');
