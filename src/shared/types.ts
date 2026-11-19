import type { StyleProp } from 'react-native';

export type FeedbackVariant = 'info' | 'warning' | 'error';

export type Feedback<Variant extends string = FeedbackVariant> = {
    message: string;
    /** Falls back to the configured default variant. */
    variant?: Variant;
};

export type ValidationResult<Variant extends string = FeedbackVariant> = {
    valid: boolean;
    /** Feedback variant while invalid; falls back to the feedback's variant. */
    variant?: Variant;
    message?: string;
};

/** Built-in theme names; custom definitions may use any string union. */
export type ThemeMode = 'light' | 'dark';

/** Shared size scale; components supporting a subset narrow it via Extract. */
export type Size = 'xs' | 's' | 'm' | 'l' | 'xl';

/** Per-slot style overrides, each typed with that slot's native style. */
export type StyleOverrides<SlotStyles extends object> = {
    [Slot in keyof SlotStyles]?: StyleProp<SlotStyles[Slot]>;
};
