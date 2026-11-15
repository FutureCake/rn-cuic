import type { ReactElement, ReactNode } from 'react';
import { Children, isValidElement } from 'react';
import { BottomSheetContent } from '../slots/content';
import { BottomSheetHandle } from '../slots/handle';
import { BottomSheetMinimized } from '../slots/minimized';

export type BottomSheetSlots = {
    handleSlot: ReactElement | undefined;
    minimizedSlot: ReactElement | undefined;
    contentSlot: ReactElement | undefined;
};

function duplicateSlotWarning(slot: string) {
    console.warn(
        `BottomSheet: only one BottomSheet.${slot} is supported; extra instances are ignored.`
    );
}

/**
 * Extract the singleton slot elements from the sheet's direct children.
 * Only slot elements are accepted; the first instance of each slot wins and
 * everything else is ignored with a dev warning. Content is required.
 */
export function useBottomSheetSlots(children: ReactNode): BottomSheetSlots {
    let handleSlot: ReactElement | undefined;
    let minimizedSlot: ReactElement | undefined;
    let contentSlot: ReactElement | undefined;
    for (const child of Children.toArray(children)) {
        if (isValidElement(child) && child.type === BottomSheetHandle) {
            if (handleSlot === undefined) handleSlot = child;
            else if (__DEV__) duplicateSlotWarning('Handle');
        } else if (
            isValidElement(child) &&
            child.type === BottomSheetMinimized
        ) {
            if (minimizedSlot === undefined) minimizedSlot = child;
            else if (__DEV__) duplicateSlotWarning('Minimized');
        } else if (isValidElement(child) && child.type === BottomSheetContent) {
            if (contentSlot === undefined) contentSlot = child;
            else if (__DEV__) duplicateSlotWarning('Content');
        } else if (__DEV__) {
            console.warn(
                'BottomSheet: children must be BottomSheet.Handle, BottomSheet.Minimized or BottomSheet.Content slots; other children are ignored.'
            );
        }
    }
    if (__DEV__ && contentSlot === undefined) {
        console.warn('BottomSheet: a BottomSheet.Content child is required.');
    }
    return { handleSlot, minimizedSlot, contentSlot };
}
