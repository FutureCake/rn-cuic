import type { TextInputProps } from 'react-native';
import type { ResolvedComponentResult } from '../../providers-and-hooks';
import { createSlotContext } from '../../utils';
import type { TextFieldStyleDefinition } from './types';

/** Fixed TextField tokens/slots: parts can share the default-generic contract. */
type TextFieldContextValue =
    ResolvedComponentResult<TextFieldStyleDefinition> & {
        /** Root-owned native input props, including the wrapped handlers. */
        inputProps: TextInputProps;
        /** Active (invalid, visible) validation message, if any. */
        validationMessage: string | undefined;
        message: string | undefined;
        variant: string;
    };

export const { ContextProvider, useSlotContext } =
    createSlotContext<TextFieldContextValue>('TextField');
