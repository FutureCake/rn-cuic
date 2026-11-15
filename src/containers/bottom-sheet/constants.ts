/**
 * Fraction of the gap between adjacent snap heights a drag must cross to
 * settle on the next one instead of returning to its origin.
 */
export const SNAP_THRESHOLD = 0.35;
/** Fling velocity (pt/s) that skips intermediate snaps: down closes, up expands. */
export const VELOCITY_THRESHOLD = 1000;
export const DISMISS_DURATION = 300;
export const SPRING_CONFIG = { damping: 40, stiffness: 220 };
