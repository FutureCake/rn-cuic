import type { ResolvedComponentResult } from '../../../providers-and-hooks';
import { createSlotContext } from '../../../shared';
import type { BottomSheetStyleDefinition } from './types';

/** Fixed tokens/slots: parts can share the default-generic contract. */
type BottomSheetContextValue =
    ResolvedComponentResult<BottomSheetStyleDefinition> & {
        /**
         * Reports the bottom edge (layout y + height, relative to the sheet
         * body) of the Minimized slot so the root can derive the minimized
         * height.
         */
        onMinimizedLayout: (bottom: number) => void;
        /** Expands a minimized sheet; wired to the Minimized slot's press. */
        onMinimizedPress: () => void;
    };

export const { ContextProvider, useSlotContext } =
    createSlotContext<BottomSheetContextValue>('BottomSheet');
