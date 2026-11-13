import { useState } from 'react';
import { AnimatedPressable } from '../../lib';
import { hasSlot } from '../../utils/has-slot';
import { ContextProvider } from './context';
import { ButtonIcon } from './slots/icon';
import { ButtonText } from './slots/text';
import type { ButtonBuilderOptions, ButtonProps } from './types';

/**
 * Bind shared behavior to the configured defaults and style hooks; the slot
 * parts are shared and resolve the nearest Button root's context.
 */
export function createButton<
    Variant extends string,
    Size extends string,
    Theme extends string,
>({
    defaults,
    useStyles,
    useTheme,
}: ButtonBuilderOptions<Variant, Size, Theme>) {
    function ButtonRoot({
        text,
        icon,
        children,
        variant = defaults.variant,
        size = defaults.size,
        theme: themeProp,
        disabled = false,
        onPressIn,
        onPressOut,
        accessibilityState,
        accessibilityRole = 'button',
        styleOverrides,
        ...props
    }: ButtonProps<Variant, Size, Theme>) {
        const { theme: ambientTheme } = useTheme();
        const theme = themeProp ?? ambientTheme;
        const [pressed, setPressed] = useState(false);
        const effectivePressed = pressed && !disabled;
        const { styles, tokens } = useStyles({
            influences: { variant, size, theme },
            states: { disabled, pressed: effectivePressed },
            overrides: styleOverrides,
        });

        return (
            <ContextProvider
                value={{ styles, tokens, pressed: effectivePressed, disabled }}
            >
                <AnimatedPressable
                    {...props}
                    disabled={disabled}
                    accessibilityRole={accessibilityRole}
                    accessibilityState={{ ...accessibilityState, disabled }}
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
                    {icon !== undefined && !hasSlot(children, ButtonIcon) && (
                        <ButtonIcon source={icon} />
                    )}
                    {children}
                    {text !== undefined && !hasSlot(children, ButtonText) && (
                        <ButtonText>{text}</ButtonText>
                    )}
                </AnimatedPressable>
            </ContextProvider>
        );
    }

    return Object.assign(ButtonRoot, { Text: ButtonText, Icon: ButtonIcon });
}
