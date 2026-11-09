import { useState } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import type { UIComponentBuilderOptions } from '../../ui-component';
import { hasSlot } from '../../utils/has-slot';
import { createButtonContext } from './context';
import { createButtonIcon } from './slots/icon';
import { createButtonText } from './slots/text';
import type { ButtonProps, ButtonStyleDefinition } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Bind shared behavior and stable compound parts once, at factory creation. */
export function createButton<
    Variant extends string,
    Size extends string,
    Theme extends string,
>({
    defaults,
    useStyles,
}: UIComponentBuilderOptions<ButtonStyleDefinition<Variant, Size, Theme>>) {
    const { ContextProvider, useSlotContext } = createButtonContext();
    const ButtonText = createButtonText(useSlotContext);
    const ButtonIcon = createButtonIcon(useSlotContext);

    function ButtonRoot({
        text,
        icon,
        children,
        variant = defaults.variant,
        size = defaults.size,
        theme = defaults.theme,
        disabled = false,
        onPressIn,
        onPressOut,
        accessibilityState,
        accessibilityRole = 'button',
        styleOverrides,
        ...props
    }: ButtonProps<Variant, Size, Theme>) {
        const [pressed, setPressed] = useState(false);
        const effectivePressed = pressed && !disabled;
        const { styles, tokens } = useStyles({
            influencers: { variant, size, theme },
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
