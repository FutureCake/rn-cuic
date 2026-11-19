import { usePressedState } from '../../shared/hooks/use-pressed-state';
import { AnimatedPressable } from '../../shared/libs/reanimated';
import { hasSlot } from '../../shared/utils/has-slot';
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
    function ChipRoot<Value>({
        text,
        icon,
        showIcon = 'selected',
        onClose,
        closeIcon,
        closeAccessibilityLabel,
        children,
        value,
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
    }: ChipProps<Size, Theme, Value>) {
        const { theme: ambientTheme } = useTheme();
        const theme = themeProp ?? ambientTheme;
        const press = usePressedState({ disabled, onPressIn, onPressOut });
        const { styles, tokens } = useStyles({
            influences: { size, theme },
            states: { selected, pressed: press.pressed, disabled },
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
                    pressed: press.pressed,
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
                                  onChange?.(
                                      !selected,
                                      value ?? (text as Value | undefined)
                                  );
                                  onPress?.(event);
                              }
                            : undefined
                    }
                    onPressIn={interactive ? press.onPressIn : undefined}
                    onPressOut={interactive ? press.onPressOut : undefined}
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
