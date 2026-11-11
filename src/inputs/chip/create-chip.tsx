import { useState } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { hasSlot } from '../../utils/has-slot';
import { ContextProvider } from './context';
import { ChipClose } from './slots/close';
import { ChipIcon } from './slots/icon';
import { ChipText } from './slots/text';
import type { ChipBuilderOptions, ChipProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
        accessibilityState,
        accessibilityRole = 'checkbox',
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
                    disabled={disabled}
                    accessibilityRole={accessibilityRole}
                    accessibilityState={{
                        ...accessibilityState,
                        checked: selected,
                        disabled,
                    }}
                    onPress={(event) => {
                        onChange?.(!selected);
                        onPress?.(event);
                    }}
                    onPressIn={(event) => {
                        setPressed(true);
                        onPressIn?.(event);
                    }}
                    onPressOut={(event) => {
                        setPressed(false);
                        onPressOut?.(event);
                    }}
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
