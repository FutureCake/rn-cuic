import type { ReactNode } from 'react';
import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinition,
} from '../../../providers-and-hooks';
import type { StyleOverrides, ThemeMode } from '../../../shared/types';

/** The modal has no boolean runtime states; visibility is mount-driven. */
export type ModalStates = never;

export type ModalSlotStyles = {
    backdrop: ViewStyle;
    card: ViewStyle;
};

export type ModalTokens = {
    backgroundColor: ColorValue;
    borderColor: ColorValue;
    borderWidth: number;
    borderRadius: number;
    /** Inner padding of the card. */
    padding: number;
    /** Horizontal gap kept between the card and the screen edges. */
    marginX: number;
    /** Caps the card width on wide screens. */
    maxWidth: number;
    backdropColor: ColorValue;
    /** Backdrop opacity when the modal is fully shown; fades with the entrance. */
    backdropOpacity: number;
};

export type ModalInfluences<Theme extends string = ThemeMode> = {
    theme: Theme;
};

export type ModalStyleDefinition<Theme extends string = ThemeMode> =
    StyleDefinition<
        ModalInfluences<Theme>,
        ModalTokens,
        ModalStates,
        ModalSlotStyles
    >;

/** Supplied by createUI: instance-bound hooks. */
export type ModalBuilderOptions<Theme extends string = ThemeMode> = {
    useStyles: (
        options: ResolveComponentOptions<ModalStyleDefinition<Theme>>
    ) => ResolvedComponentResult<ModalStyleDefinition<Theme>>;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

export type ModalProps<Theme extends string = ThemeMode> = Omit<
    ViewProps,
    'children' | 'style'
> & {
    /**
     * The modal is mount-controlled: it animates in when rendered and plays
     * the exit animation automatically when unmounted. `onClose` is fired
     * by the outside press so the parent can unmount it.
     */
    onClose?: () => void;
    /**
     * Pressing outside the card closes the modal (requires `onClose`). The
     * press catcher also blocks touches on the screen behind. Defaults to
     * true.
     */
    closeOnPressOutside?: boolean;
    /**
     * Render the colored scrim behind the card. Purely visual and
     * independent of `closeOnPressOutside`. Defaults to true.
     */
    backdrop?: boolean;
    /** Minimum card width; the card otherwise hugs its content. */
    minWidth?: number;
    /** Caps the card width; overrides the `maxWidth` token per instance. */
    maxWidth?: number;
    /**
     * Minimum horizontal gap kept between the card and the screen edges;
     * overrides the `marginX` token per instance. Wins over
     * `minWidth`/`maxWidth` when they would push the card past it.
     */
    minHorizontalSpacing?: number;
    /** Arbitrary content rendered inside the card. */
    children?: ReactNode;
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    /** Merged into the card slot's style. */
    style?: StyleProp<ViewStyle>;
    styleOverrides?: StyleOverrides<ModalSlotStyles>;
};
