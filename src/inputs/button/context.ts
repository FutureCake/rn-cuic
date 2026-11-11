import type { ResolvedComponentResult } from '../../providers-and-hooks';
import { createSlotContext } from '../../utils';
import type { ButtonStyleDefinition } from './types';

/** Fixed Button tokens/slots: parts can share the default-generic contract. */
type ButtonContextValue = ResolvedComponentResult<ButtonStyleDefinition> & {
    pressed: boolean;
    disabled: boolean;
};

export const { ContextProvider, useSlotContext } =
    createSlotContext<ButtonContextValue>('Button');
