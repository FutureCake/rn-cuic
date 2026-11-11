import type { SharedValue } from 'react-native-reanimated';
import type { ResolvedComponentResult } from '../../providers-and-hooks';
import { createSlotContext } from '../../utils';
import type { SwitchStyleDefinition } from './types';

/** Fixed Switch tokens/slots: parts can share the default-generic contract. */
type SwitchContextValue = ResolvedComponentResult<SwitchStyleDefinition> & {
    disabled: boolean;
    /** Animated selected index; drives the option text color crossfade. */
    selectedIndex: SharedValue<number>;
    /** Settled selected index for render props and accessibility. */
    settledIndex: number;
    /** Resolve an option's position from its value (first match wins). */
    indexOf: (value: unknown) => number;
    select: (value: unknown) => void;
    /** Options report their measured layout so the root can place the indicator. */
    registerOption: (
        index: number,
        layout: { x: number; width: number }
    ) => void;
};

export const { ContextProvider, useSlotContext } =
    createSlotContext<SwitchContextValue>('Switch');
