import {
    Children,
    Fragment,
    isValidElement,
    type ReactElement,
    type ReactNode,
} from 'react';

/** Detect explicit parts through arrays/fragments, never through other elements. */
export function hasSlot(
    children: ReactNode,
    slot: ReactElement['type']
): boolean {
    return Children.toArray(children).some((child) => {
        if (!isValidElement<{ children?: ReactNode }>(child)) {
            return false;
        }
        return (
            child.type === slot ||
            (child.type === Fragment && hasSlot(child.props.children, slot))
        );
    });
}
