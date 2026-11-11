import type { ResolvedComponentResult } from '../../providers-and-hooks';
import { createSlotContext } from '../../utils';
import type { ChipStyleDefinition } from './types';

/** Fixed Chip tokens/slots: parts can share the default-generic contract. */
type ChipContextValue = ResolvedComponentResult<ChipStyleDefinition> & {
    selected: boolean;
    pressed: boolean;
    disabled: boolean;
    onClose?: () => void;
};

export const { ContextProvider, useSlotContext } =
    createSlotContext<ChipContextValue>('Chip');
