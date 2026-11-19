import type { ReactElement, ReactNode } from 'react';
import { extractSingletonSlots } from '../../../shared/utils/extract-singleton-slots';
import { BottomSheetContent } from '../slots/content';
import { BottomSheetHandle } from '../slots/handle';
import { BottomSheetMinimized } from '../slots/minimized';

export type BottomSheetSlots = {
    handleSlot: ReactElement | undefined;
    minimizedSlot: ReactElement | undefined;
    contentSlot: ReactElement | undefined;
};

/**
 * Extract the singleton slot elements from the sheet's direct children.
 * Only slot elements are accepted; the first instance of each slot wins and
 * everything else is ignored with a dev warning. Content is required.
 */
export function useBottomSheetSlots(children: ReactNode): BottomSheetSlots {
    const { slots, rest } = extractSingletonSlots('BottomSheet', children, {
        Handle: BottomSheetHandle,
        Minimized: BottomSheetMinimized,
        Content: BottomSheetContent,
    });
    if (__DEV__ && rest.length > 0) {
        console.warn(
            'BottomSheet: children must be BottomSheet.Handle, BottomSheet.Minimized or BottomSheet.Content slots; other children are ignored.'
        );
    }
    if (__DEV__ && slots.Content === undefined) {
        console.warn('BottomSheet: a BottomSheet.Content child is required.');
    }
    return {
        handleSlot: slots.Handle,
        minimizedSlot: slots.Minimized,
        contentSlot: slots.Content,
    };
}
