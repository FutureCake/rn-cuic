import { useState } from 'react';
import { AnimatedPressable } from '../../lib';
import { hasSlot } from '../../utils/has-slot';
import { ContextProvider } from './context';
import { ChipClose } from './slots/close';
import { ChipIcon } from './slots/icon';
import { ChipText } from './slots/text';
import type { ChipBuilderOptions, ChipProps } from './types';

/**
 * Bind shared behavior to the configured defaults and style hooks; the slot
 * parts are shared and resolve the nearest Chip root's context.
 */
export function createChip<Size extends string, Theme extends string>({
    defaults,
    useStyles,
    useTheme,
}: ChipBuilderOptions<Size, Theme>) {
    function ChipRoot({
        text,
        icon,
        showIcon = 'selected',
        onClose,
        closeIcon,
        closeAccessibilityLabel,
        children,
        size = defaults.size,
        theme: themeProp,
        selected = false,
        onChange,
        disabled = false,
        onPress,
        onPressIn,
        onPressOut,
        onLongPress,
        accessibilityState,
        accessibilityRole,
        styleOverrides,
        ...props
    }: ChipProps<Size, Theme>) {
        const { theme: ambientTheme } = useTheme();
        const theme = themeProp ?? ambientTheme;
        const [pressed, setPressed] = useState(false);
        const effectivePressed = pressed && !disabled;
        const { styles, tokens } = useStyles({
            influences: { size, theme },
            states: { selected, pressed: effectivePressed, disabled },
            overrides: styleOverrides,
        });
        const showsShorthandIcon =
            icon !== undefined && (showIcon === 'always' || selected);
        /** No interaction handlers → static display item. */
        const interactive =
            onChange !== undefined ||
            onPress !== undefined ||
            onPressIn !== undefined ||
            onPressOut !== undefined ||
            onLongPress !== undefined;

        return (
            <ContextProvider
                value={{
                    styles,
                    tokens,
                    selected,
                    pressed: effectivePressed,
                    disabled,
                    onClose,
                }}
            >
                <AnimatedPressable
                    {...props}
                    disabled={interactive ? disabled : undefined}
                    accessibilityRole={
                        accessibilityRole ?? (interactive ? 'checkbox' : 'text')
                    }
                    accessibilityState={
                        interactive
                            ? {
                                  ...accessibilityState,
                                  checked: selected,
                                  disabled,
                              }
                            : {
                                  ...accessibilityState,
                                  selected: selected || undefined,
                              }
                    }
                    onLongPress={onLongPress}
                    onPress={
                        interactive
                            ? (event) => {
                                  onChange?.(!selected);
                                  onPress?.(event);
                              }
                            : undefined
                    }
                    onPressIn={
                        interactive
                            ? (event) => {
                                  setPressed(true);
                                  onPressIn?.(event);
                              }
                            : undefined
                    }
                    onPressOut={
                        interactive
                            ? (event) => {
                                  setPressed(false);
                                  onPressOut?.(event);
                              }
                            : undefined
                    }
                    style={styles.container}
                >
                    {showsShorthandIcon && !hasSlot(children, ChipIcon) && (
                        <ChipIcon source={icon} />
                    )}
                    {children}
                    {text !== undefined && !hasSlot(children, ChipText) && (
                        <ChipText>{text}</ChipText>
                    )}
                    {onClose !== undefined && !hasSlot(children, ChipClose) && (
                        <ChipClose
                            source={closeIcon}
                            accessibilityLabel={closeAccessibilityLabel}
                        />
                    )}
                </AnimatedPressable>
            </ContextProvider>
        );
    }

    return Object.assign(ChipRoot, {
        Text: ChipText,
        Icon: ChipIcon,
        Close: ChipClose,
    });
}
