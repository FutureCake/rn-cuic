import {
    Children,
    isValidElement,
    type ElementType,
    type ReactElement,
    type ReactNode,
} from 'react';

export type ExtractedSlots<Slots extends Record<string, ElementType>> = {
    /** The first instance of each slot, keyed by the given slot name. */
    slots: { [Name in keyof Slots]: ReactElement | undefined };
    /** All remaining children, in order. */
    rest: ReactNode[];
};

/**
 * Extract singleton slot elements from direct children, matched by element
 * type. The first instance of each slot wins; duplicates are dropped with a
 * dev warning. Non-slot children are returned as `rest`.
 */
export function extractSingletonSlots<
    Slots extends Record<string, ElementType>,
>(
    component: string,
    children: ReactNode,
    slotTypes: Slots
): ExtractedSlots<Slots> {
    const slots = {} as { [Name in keyof Slots]: ReactElement | undefined };
    const rest: ReactNode[] = [];
    const entries = Object.entries(slotTypes);
    for (const child of Children.toArray(children)) {
        const match = isValidElement(child)
            ? entries.find(([, type]) => child.type === type)
            : undefined;
        if (match === undefined || !isValidElement(child)) {
            rest.push(child);
            continue;
        }
        const name = match[0] as keyof Slots;
        if (slots[name] === undefined) {
            slots[name] = child;
        } else if (__DEV__) {
            console.warn(
                `${component}: only one ${component}.${String(name)} child is supported; extras are ignored.`
            );
        }
    }
    return { slots, rest };
}
