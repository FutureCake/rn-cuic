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

/** Numeric font weights; a face map picks the nearest available one. */
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/** Roles every preset relies on; `heading` falls back to `body`. */
export type BuiltInFontRole = 'body' | 'heading';

/**
 * A key into createUI `fonts`. Built-in roles autocomplete; custom roles are
 * any other string, checked at runtime (unknown roles warn and use `body`).
 */
export type FontRole = BuiltInFontRole | (string & {});

/**
 * A natively registered family name (fontWeight passes through), or one face
 * name per weight for fonts loaded as separate files (e.g. `Inter-Bold`).
 */
export type FontSpec = string | Partial<Record<FontWeight, string>>;

/** Font roles for createUI; omitted roles fall back to body, then system. */
export type Fonts = Partial<Record<FontRole, FontSpec>>;

/** Per-slot style overrides, each typed with that slot's native style. */
export type StyleOverrides<SlotStyles extends object> = {
    [Slot in keyof SlotStyles]?: StyleProp<SlotStyles[Slot]>;
};
