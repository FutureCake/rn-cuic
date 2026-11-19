import type { ReactNode } from 'react';
import type {
    ColorValue,
    StyleProp,
    TextStyle,
    ViewProps,
    ViewStyle,
} from 'react-native';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinition,
} from '../../providers-and-hooks';
import type { StyleOverrides, ThemeMode } from '../../shared/types';
import type {
    Feedback,
    FeedbackVariant,
    ValidationResult,
} from '../text-inputs/shared/types';

/** Shared feedback contract, re-exported for the chips entry point. */
export type {
    Feedback,
    FeedbackVariant,
    ValidationResult,
} from '../text-inputs/shared/types';

/**
 * Layout drives structure (wrapping rows vs a single scrollable line), so its
 * values are fixed — unlike purely visual influences it is not extensible.
 */
export type ChipsLayout = 'wrap' | 'scroll';

export type ChipsStates = 'disabled';

export type ChipsSlotStyles = {
    container: ViewStyle;
    /** The chip row: the wrapping row or the scroll content. */
    content: ViewStyle;
    header: TextStyle;
    feedback: TextStyle;
};

export type ChipsTokens = {
    headerFontSize: number;
    feedbackFontSize: number;
    /** Leave undefined to use the platform system font. */
    fontFamily: TextStyle['fontFamily'];
    /** Space between chips on a line. */
    gap: number;
    /** Space between wrapped lines. */
    rowGap: number;
    /** Space between the header, chips and feedback. */
    sectionGap: number;
    headerColor: ColorValue;
    feedbackColor: ColorValue;
};

export type ChipsInfluences<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = { layout: ChipsLayout; feedbackVariant: Variant; theme: Theme };

export type ChipsStyleDefinition<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = StyleDefinition<
    ChipsInfluences<Variant, Theme>,
    ChipsTokens,
    ChipsStates,
    ChipsSlotStyles
>;

/**
 * Selection validation; runs on every selection change against the next
 * selection. `Selection` is `Value | null` (single) or `Value[]` (multi).
 */
export type ChipsValidation<
    Selection,
    Variant extends string = FeedbackVariant,
> = {
    validator: (selection: Selection) => ValidationResult<Variant>;
    onValidation?: (result: ValidationResult<Variant>) => void;
};

/**
 * Data-driven chip, rendered by the group with the preset chip styling.
 * `value` is the identity used for selection, `onChange` and `onClose`.
 */
export type ChipsOption<Value> = {
    title: string;
    value: Value;
};

/** Supplied by createUI: configured defaults plus instance-bound hooks. */
export type ChipsBuilderOptions<
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = {
    defaults: { layout: ChipsLayout; feedbackVariant: Variant };
    useStyles: (
        options: ResolveComponentOptions<ChipsStyleDefinition<Variant, Theme>>
    ) => ResolvedComponentResult<ChipsStyleDefinition<Variant, Theme>>;
    /** Read-only ambient theme; components consume it but never set it. */
    useTheme: () => { theme: Theme };
};

type ChipsBaseProps<Value, Variant extends string, Theme extends string> = Omit<
    ViewProps,
    'children' | 'style'
> & {
    /** Wrapping rows (default) or a single scrollable line. */
    layout?: ChipsLayout;
    /** Overrides the ambient theme from StylesProvider for this instance. */
    theme?: Theme;
    /** Disables the group; spread onto options-rendered chips only. */
    disabled?: boolean;
    /** Size for options-rendered chips; composed Chip children set their own. */
    size?: string;
    /** Shorthand for a Header child. */
    header?: string;
    /** Default feedback message; shorthand for a Feedback child. */
    feedback?: string | Feedback<Variant>;
    /**
     * Shows a close affordance on every identified chip and fires with that
     * chip's identity (`value ?? text`); a chip's own `onClose` also fires.
     * The parent owns removal.
     */
    onClose?: (value: Value) => void;
    /** Outer container style. */
    style?: StyleProp<ViewStyle>;
    styleOverrides?: StyleOverrides<ChipsSlotStyles>;
    /**
     * Data-driven chips, rendered with the preset chip styling and
     * controlled by the group; the group's size/disabled/theme are spread
     * onto them. Mutually exclusive with Chip children: when both are given,
     * options win and chip children are ignored. For custom chip content or
     * styling, compose Chip children instead.
     */
    options?: readonly ChipsOption<Value>[];
    /**
     * Chip children; the group controls them by injecting only the control
     * wiring: `selected` and `onChange` (identity is the chip's `value ??
     * text`) plus `onClose` chaining — visual props like size stay the
     * chip's own. Chips without an identity are left untouched. Chips.Header
     * and Chips.Feedback are extracted from the direct children (in both
     * modes) and always render header → chips → feedback; one of each,
     * extras are dropped.
     */
    children?: ReactNode;
};

type ChipsSelectionProps<Value, Variant extends string> =
    | {
          /** One selected value at most; tapping it again deselects. */
          selectionMode?: 'single';
          value?: Value | null;
          onChange?: (value: Value | null) => void;
          validation?: ChipsValidation<Value | null, Variant>;
      }
    | {
          selectionMode: 'multi';
          value?: Value[];
          onChange?: (value: Value[]) => void;
          validation?: ChipsValidation<Value[], Variant>;
      }
    | {
          /** Layout and forwarding only: no selection is injected. */
          selectionMode: 'none';
          value?: never;
          onChange?: never;
          validation?: never;
      };

/** Single-select group: `value` is the selected chip identity or null. */
export type ChipsSingleProps<
    Value = unknown,
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = ChipsBaseProps<Value, Variant, Theme> & {
    /** One selected value at most; tapping it again deselects. */
    selectionMode?: 'single';
    value?: Value | null;
    onChange?: (value: Value | null) => void;
    validation?: ChipsValidation<Value | null, Variant>;
};

/** Multi-select group: `value` is the list of selected chip identities. */
export type ChipsMultiProps<
    Value = unknown,
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = ChipsBaseProps<Value, Variant, Theme> & {
    selectionMode: 'multi';
    value?: Value[];
    onChange?: (value: Value[]) => void;
    validation?: ChipsValidation<Value[], Variant>;
};

/** Non-selecting group: layout and forwarded defaults only. */
export type ChipsStaticProps<
    Value = unknown,
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = ChipsBaseProps<Value, Variant, Theme> & {
    selectionMode: 'none';
    value?: never;
    onChange?: never;
    validation?: never;
};

export type ChipsProps<
    Value = unknown,
    Variant extends string = FeedbackVariant,
    Theme extends string = ThemeMode,
> = ChipsBaseProps<Value, Variant, Theme> & ChipsSelectionProps<Value, Variant>;
