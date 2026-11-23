import type { ReactNode } from 'react';
import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinition,
} from '../../../providers-and-hooks';
import type { StyleOverrides, ThemeMode } from '../../../shared/types';

/** The sheet has no boolean runtime states; position is gesture-driven. */
export type BottomSheetStates = never;

export type BottomSheetSlotStyles = {
    backdrop: ViewStyle;
    sheet: ViewStyle;
    handleWrapper: ViewStyle;
    handle: ViewStyle;
    minimized: ViewStyle;
    content: ViewStyle;
};

export type BottomSheetTokens = {
    backgroundColor: ColorValue;
    /** Radius of the sheet's two top corners. */
    topRadius: number;
    handleColor: ColorValue;
    handleWidth: number;
    handleHeight: number;
    backdropColor: ColorValue;
    /** Backdrop opacity when the sheet is fully open; fades with position. */
    backdropOpacity: number;
    contentPaddingX: number;
    contentPaddingBottom: number;
    /** Minimum gap kept between the screen top and the sheet. */
    topSafeArea: number;
    /**
     * Bottom clearance (home indicator / gesture bar) rendered as extra
     * body padding so expanded content never sits in the inset zone. A
     * plain number like topSafeArea; tune it per app (or override with a
     * measured device inset).
     */
    bottomSafeArea: number;
};

export type BottomSheetInfluences<Theme extends string = ThemeMode> = {
    theme: Theme;
};

export type BottomSheetStyleDefinition<Theme extends string = ThemeMode> =
    StyleDefinition<
        BottomSheetInfluences<Theme>,
        BottomSheetTokens,
        BottomSheetStates,
        BottomSheetSlotStyles
    >;

/** Supplied by createUI: instance-bound hooks. */
export type BottomSheetBuilderOptions<Theme extends string = ThemeMode> = {
    useStyles: (
        options: ResolveComponentOptions<BottomSheetStyleDefinition<Theme>>
    ) => ResolvedComponentResult<BottomSheetStyleDefinition<Theme>>;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

export type BottomSheetProps<Theme extends string = ThemeMode> = Omit<
    ViewProps,
    'children' | 'style'
> & {
    /**
     * The sheet is mount-controlled: it animates in when rendered and calls
     * `onClose` after the dismiss animation so the parent can unmount it.
     * Without it the sheet cannot close itself and is removed by unmounting
     * (which skips the exit animation).
     */
    onClose?: () => void;
    /**
     * Pressing outside the sheet closes it (requires `onClose`). The press
     * catcher also blocks touches on the screen behind. Ignored while the
     * sheet is persistent (Minimized slot without `minimizedClosable`), so
     * the screen behind stays interactive. Defaults to true.
     */
    closeOnPressOutside?: boolean;
    /**
     * Render the colored scrim behind the sheet. Purely visual and
     * independent of `closeOnPressOutside`. Suppressed while the sheet is
     * persistent, keeping the screen behind interactive. Defaults to false.
     */
    backdrop?: boolean;
    /**
     * Minimum minimized-state height. The height measured from the
     * Minimized slot still wins when it is larger, so its content is never
     * cut off; when neither is present the sheet opens fully expanded.
     */
    initialHeight?: number;
    /** Caps the expanded height (still clamped to the screen/keyboard). */
    maxHeight?: number;
    /**
     * Whether a sheet with a Minimized slot can be closed by the user: a
     * small swipe down settles on the minimized state, a larger swipe or
     * fling closes (requires `onClose`). Defaults to false — swiping down
     * always settles on the minimized state and the sheet is only removed
     * by unmounting.
     */
    minimizedClosable?: boolean;
    /**
     * Show the grab handle even when a Minimized slot is present, which
     * also enables swiping up to expand (otherwise tapping the minimized
     * content is the only way up). Composing BottomSheet.Handle implies
     * this. Defaults to false.
     */
    showHandleOnMinimized?: boolean;
    /** Fired when the sheet settles on the expanded or minimized snap point. */
    onExpandedChange?: (expanded: boolean) => void;
    /**
     * Slot elements only: BottomSheet.Content (required) plus optional
     * BottomSheet.Handle and BottomSheet.Minimized, rendered in a fixed
     * order: handle, minimized, content. Each slot is a singleton — only
     * the first instance renders; extras and non-slot children are ignored
     * with a dev warning. Slots nested inside fragments or other elements
     * are not extracted — keep them direct children.
     */
    children?: ReactNode;
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    /**
     * Merged into the sheet slot's style. The sheet is a bottom-anchored
     * absolute element that clips its content — lift or inset it with
     * `bottom`/`left`/`right` offsets to float it off the screen edge.
     */
    style?: StyleProp<ViewStyle>;
    styleOverrides?: StyleOverrides<BottomSheetSlotStyles>;
};
