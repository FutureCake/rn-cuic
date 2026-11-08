import type { ResolvedComponentResult } from '../../providers-and-hooks';
import { createSlotContext } from '../../utils';
import type { ButtonStyleDefinition } from './types';

type ButtonContextValue = ResolvedComponentResult<ButtonStyleDefinition> & {
    pressed: boolean;
    disabled: boolean;
};

const { Provider: ButtonSlotProvider, useSlotContext: useButtonContext } =
    createSlotContext<ButtonContextValue>('Button');

export default ButtonSlotProvider;
export { useButtonContext };
