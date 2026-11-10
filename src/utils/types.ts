import type { StyleProp } from 'react-native';

/** Per-slot style overrides, each typed with that slot's native style. */
export type StyleOverrides<SlotStyles extends object> = {
    [Slot in keyof SlotStyles]?: StyleProp<SlotStyles[Slot]>;
};
