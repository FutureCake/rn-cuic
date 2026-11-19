import {
    cloneElement,
    isValidElement,
    type ReactElement,
    type ReactNode,
} from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { resolveComponentStyles } from '../../providers-and-hooks';
import { useValidationFeedback } from '../../shared/hooks/use-validation-feedback';
import { extractSingletonSlots } from '../../shared/utils/extract-singleton-slots';
import { createChip } from '../chip/create-chip';
import { chipStyleDefinition } from '../chip/styles';
import { ContextProvider } from './context';
import { ChipsFeedback } from './slots/feedback';
import { ChipsHeader } from './slots/header';
import type {
    ChipsBuilderOptions,
    ChipsMultiProps,
    ChipsOption,
    ChipsProps,
    ChipsSingleProps,
    ChipsStaticProps,
    ChipsValidation,
} from './types';

/** The Chip props the group controls; any chip-shaped child qualifies. */
type ControlledChipProps = {
    value?: unknown;
    text?: string;
    selected?: boolean;
    onChange?: (selected: boolean, value?: unknown) => void;
    onClose?: () => void;
};

/** Structural layout; visual styling belongs to the slot styles. */
const structural = StyleSheet.create({
    row: { flexDirection: 'row' },
    wrap: { flexWrap: 'wrap' },
    scroll: { flexGrow: 0 },
});

/** Stable keys for primitive option values; title/index for the rest. */
function optionKey(option: ChipsOption<unknown>, index: number): string {
    const { value, title } = option;
    if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
    }
    return title || `option-${index}`;
}

/**
 * Bind shared behavior to the configured defaults and style hooks. The group
 * is a controller: `options` render preset chips carrying the group's visual
 * props, while composed Chip children only get the control wiring injected
 * (`selected`/`onChange`/`onClose`) and feed control actions back to the
 * group's caller.
 */
export function createChips<Variant extends string, Theme extends string>({
    defaults,
    useStyles,
    useTheme,
}: ChipsBuilderOptions<Variant, Theme>) {
    /**
     * Renders `options` with the preset chip styling. Resolved outside the
     * styles manager, so provider overrides for a `Chip` key do not reach it;
     * restyle per option via `styleOverrides` or compose Chip children.
     */
    const OptionChip = createChip<string, Theme>({
        defaults: { size: 'm' },
        useStyles: (options) =>
            resolveComponentStyles(
                chipStyleDefinition,
                options as never
            ) as never,
        useTheme,
    });

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
        options,
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
            const injected: ControlledChipProps = {};
            if (selectionEnabled) {
                injected.selected = isSelected(identity);
                injected.onChange = (next, chipValue) => {
                    toggle(identity);
                    chipProps.onChange?.(next, chipValue);
                };
            }
            if (groupClose !== undefined) {
                injected.onClose = () => {
                    chipProps.onClose?.();
                    groupClose(identity);
                };
            }
            return cloneElement(child, injected);
        };
        const useOptions = options !== undefined;
        if (__DEV__ && useOptions && chips.length > 0) {
            console.warn(
                'Chips: both options and chip children were provided; options win and chip children are ignored.'
            );
        }
        const renderedChips = useOptions
            ? options.map((option, index) => (
                  <OptionChip
                      key={optionKey(option, index)}
                      text={option.title}
                      value={option.value}
                      theme={themeProp}
                      size={size}
                      disabled={disabled}
                      selected={
                          selectionEnabled
                              ? isSelected(option.value)
                              : undefined
                      }
                      onChange={
                          selectionEnabled
                              ? () => toggle(option.value)
                              : undefined
                      }
                      onClose={
                          groupClose === undefined
                              ? undefined
                              : () => groupClose(option.value)
                      }
                  />
              ))
            : chips.map(controlChip);

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
