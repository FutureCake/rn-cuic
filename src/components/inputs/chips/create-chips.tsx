import {
    cloneElement,
    isValidElement,
    type ReactElement,
    type ReactNode,
} from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useValidationFeedback } from '../../../shared/hooks/use-validation-feedback';
import { extractSingletonSlots } from '../../../shared/utils/extract-singleton-slots';
import type { ChipProps } from '../chip/types';
import { ContextProvider } from './context';
import { ChipsFeedback } from './slots/feedback';
import { ChipsHeader } from './slots/header';
import type {
    ChipsBuilderOptions,
    ChipsMultiProps,
    ChipsProps,
    ChipsSingleProps,
    ChipsStaticProps,
    ChipsValidation,
} from './types';

/**
 * The Chip props the group reads and injects. Derived from ChipProps so a
 * renamed Chip prop fails to compile here; Size/Theme widen to `string`
 * because the group cannot know the app's configured unions.
 */
type ControlledChipProps = Pick<
    ChipProps<string, string>,
    | 'value'
    | 'text'
    | 'size'
    | 'theme'
    | 'disabled'
    | 'selected'
    | 'onChange'
    | 'onClose'
>;

/** Structural layout; visual styling belongs to the slot styles. */
const structural = StyleSheet.create({
    row: { flexDirection: 'row' },
    wrap: { flexWrap: 'wrap' },
    scroll: { flexGrow: 0 },
});

/**
 * Bind shared behavior to the configured defaults and style hooks. The group
 * is a controller: Chip children get the control wiring injected
 * (`selected`/`onChange`/`onClose`) plus the group's `disabled` and default
 * `size`, and feed control actions back to the group's caller.
 */
export function createChips<Variant extends string, Theme extends string>({
    defaults,
    useStyles,
    useTheme,
}: ChipsBuilderOptions<Variant, Theme>) {
    /**
     * Overloads per selection mode keep JSX generic inference exact; single
     * is declared last so ComponentProps resolves to the default mode.
     */
    function ChipsRoot<Value>(
        props: ChipsMultiProps<Value, Variant, Theme>
    ): ReactElement;
    function ChipsRoot<Value>(
        props: ChipsStaticProps<Value, Variant, Theme>
    ): ReactElement;
    function ChipsRoot<Value>(
        props: ChipsSingleProps<Value, Variant, Theme>
    ): ReactElement;
    function ChipsRoot<Value>({
        layout = defaults.layout,
        theme: themeProp,
        disabled,
        size,
        header,
        feedback,
        selectionMode = 'single',
        value,
        onChange,
        validation,
        onClose,
        style,
        styleOverrides,
        children,
        ...props
    }: ChipsProps<Value, Variant, Theme>) {
        const { theme: ambientTheme } = useTheme();
        const theme = themeProp ?? ambientTheme;
        const {
            variant,
            validationMessage,
            message,
            feedbackMessage,
            runValidation,
        } = useValidationFeedback({
            feedback,
            validation: validation as
                ChipsValidation<unknown, Variant> | undefined,
            defaultVariant: defaults.feedbackVariant,
        });

        const { styles, tokens } = useStyles({
            influences: { layout, feedbackVariant: variant, theme },
            states: { disabled: disabled ?? false },
            overrides: {
                ...styleOverrides,
                container: [styleOverrides?.container, style],
            },
        });

        const selectionEnabled = selectionMode !== 'none';
        const singleValue =
            selectionMode === 'single'
                ? ((value as Value | null | undefined) ?? null)
                : null;
        const multiValue =
            selectionMode === 'multi'
                ? ((value as Value[] | undefined) ?? [])
                : [];

        const isSelected = (chipValue: unknown) =>
            selectionMode === 'multi'
                ? multiValue.includes(chipValue as Value)
                : selectionMode === 'single' &&
                  singleValue !== null &&
                  chipValue === singleValue;

        const toggle = (chipValue: unknown) => {
            if (selectionMode === 'single') {
                const next =
                    chipValue === singleValue ? null : (chipValue as Value);
                (onChange as ((next: Value | null) => void) | undefined)?.(
                    next
                );
                runValidation(next);
            } else if (selectionMode === 'multi') {
                const next = multiValue.includes(chipValue as Value)
                    ? multiValue.filter((item) => item !== chipValue)
                    : [...multiValue, chipValue as Value];
                (onChange as ((next: Value[]) => void) | undefined)?.(next);
                runValidation(next);
            }
        };

        /**
         * Order is enforced (header → chips → feedback) because the chips
         * must land inside the content wrapper — composed slots cannot
         * render in place here.
         */
        const { slots, rest: chips } = extractSingletonSlots(
            'Chips',
            children,
            { Header: ChipsHeader, Feedback: ChipsFeedback }
        );
        const groupClose = onClose as
            ((chipValue: unknown) => void) | undefined;

        /** Identity is `value ?? text`; without one, the chip is untouched. */
        const controlChip = (child: ReactNode): ReactNode => {
            if (!isValidElement<ControlledChipProps>(child)) return child;
            const chipProps = child.props;
            const identity = chipProps.value ?? chipProps.text;
            if (identity === undefined) return child;
            // Only set keys are spread: cloneElement treats an explicit
            // `undefined` as a value and would erase the chip's own prop.
            // A disabled group disables every chip; the group's size and
            // theme are only defaults, so a chip's own values win.
            const injected: ControlledChipProps = {
                ...(disabled && { disabled: true }),
                ...(size !== undefined &&
                    chipProps.size === undefined && { size }),
                ...(themeProp !== undefined &&
                    chipProps.theme === undefined && { theme: themeProp }),
                ...(selectionEnabled && {
                    selected: isSelected(identity),
                    onChange: (next: boolean, chipValue: unknown) => {
                        toggle(identity);
                        chipProps.onChange?.(next, chipValue);
                    },
                }),
                ...(groupClose !== undefined && {
                    onClose: () => {
                        chipProps.onClose?.();
                        groupClose(identity);
                    },
                }),
            };
            return cloneElement(child, injected);
        };
        const renderedChips = chips.map(controlChip);

        return (
            <ContextProvider
                value={{ styles, tokens, validationMessage, message, variant }}
            >
                <Animated.View {...props} style={styles.container}>
                    {slots.Header ??
                        (header !== undefined && (
                            <ChipsHeader>{header}</ChipsHeader>
                        ))}
                    {layout === 'scroll' ? (
                        <Animated.ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={structural.scroll}
                        >
                            <Animated.View
                                style={[structural.row, styles.content]}
                            >
                                {renderedChips}
                            </Animated.View>
                        </Animated.ScrollView>
                    ) : (
                        <Animated.View
                            style={[
                                structural.row,
                                structural.wrap,
                                styles.content,
                            ]}
                        >
                            {renderedChips}
                        </Animated.View>
                    )}
                    {slots.Feedback ?? (
                        <ChipsFeedback>{feedbackMessage}</ChipsFeedback>
                    )}
                </Animated.View>
            </ContextProvider>
        );
    }

    return Object.assign(ChipsRoot, {
        Header: ChipsHeader,
        Feedback: ChipsFeedback,
    });
}
