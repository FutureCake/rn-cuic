import { useState } from 'react';
import type { PressableProps } from 'react-native';

type PressHandler = PressableProps['onPressIn'];

/**
 * Pressed-state tracking for pressable roots: wraps the caller's press
 * handlers and suppresses the pressed state while disabled.
 */
export function usePressedState({
    disabled,
    onPressIn,
    onPressOut,
}: {
    disabled: boolean;
    onPressIn: PressHandler;
    onPressOut: PressHandler;
}) {
    const [pressed, setPressed] = useState(false);
    return {
        pressed: pressed && !disabled,
        onPressIn: ((event) => {
            setPressed(true);
            onPressIn?.(event);
        }) satisfies PressHandler,
        onPressOut: ((event) => {
            setPressed(false);
            onPressOut?.(event);
        }) satisfies PressHandler,
    };
}
