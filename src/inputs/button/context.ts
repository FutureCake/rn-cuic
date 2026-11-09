import type { ResolvedComponentResult } from '../../providers-and-hooks';
import { createSlotContext } from '../../utils';
import type { ButtonStyleDefinition } from './types';

type ButtonContextValue = ResolvedComponentResult<ButtonStyleDefinition> & {
    pressed: boolean;
    disabled: boolean;
};

/** Each configured Button family owns its parts and their nearest-root context. */
export function createButtonContext() {
    return createSlotContext<ButtonContextValue>('Button');
}

export type UseButtonContext = ReturnType<
    typeof createButtonContext
>['useSlotContext'];
