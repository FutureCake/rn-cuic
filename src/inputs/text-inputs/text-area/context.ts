import type { ResolvedComponentResult } from '../../../providers-and-hooks';
import { createSlotContext } from '../../../utils';
import type { FieldContextBase } from '../shared/types';
import type { TextAreaStyleDefinition } from './types';

/** Fixed TextArea tokens/slots: parts can share the default-generic contract. */
type TextAreaContextValue = ResolvedComponentResult<TextAreaStyleDefinition> &
    FieldContextBase & {
        /** Input height from numLines/grow and the measured line height. */
        inputHeight: number;
    };

export const { ContextProvider, useSlotContext } =
    createSlotContext<TextAreaContextValue>('TextArea');
