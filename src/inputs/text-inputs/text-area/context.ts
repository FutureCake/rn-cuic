import type { TextInputProps } from 'react-native';
import type { ResolvedComponentResult } from '../../../providers-and-hooks';
import { createSlotContext } from '../../../utils';
import type { TextAreaStyleDefinition } from './types';

/** Fixed TextArea tokens/slots: parts can share the default-generic contract. */
type TextAreaContextValue = ResolvedComponentResult<TextAreaStyleDefinition> & {
    /** Root-owned native input props, including the wrapped handlers. */
    inputProps: TextInputProps;
    /** Input height from numLines/grow and the measured line height. */
    inputHeight: number;
    /** Active (invalid, visible) validation message, if any. */
    validationMessage: string | undefined;
    message: string | undefined;
    variant: string;
};

export const { ContextProvider, useSlotContext } =
    createSlotContext<TextAreaContextValue>('TextArea');
