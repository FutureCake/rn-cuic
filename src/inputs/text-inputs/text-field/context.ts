import type { ResolvedComponentResult } from '../../../providers-and-hooks';
import { createSlotContext } from '../../../utils';
import type { FieldContextBase } from '../shared/types';
import type { TextFieldStyleDefinition } from './types';

/** Fixed TextField tokens/slots: parts can share the default-generic contract. */
type TextFieldContextValue = ResolvedComponentResult<TextFieldStyleDefinition> &
    FieldContextBase;

export const { ContextProvider, useSlotContext } =
    createSlotContext<TextFieldContextValue>('TextField');
