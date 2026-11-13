import type { StyleProp } from 'react-native';

/** Built-in theme names; custom definitions may use any string union. */
export type ThemeMode = 'light' | 'dark';

/** Per-slot style overrides, each typed with that slot's native style. */
export type StyleOverrides<SlotStyles extends object> = {
    [Slot in keyof SlotStyles]?: StyleProp<SlotStyles[Slot]>;
};
