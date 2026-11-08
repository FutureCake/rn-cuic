import { useState } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useResolveComponentStyles } from 'rn-cuic';
import { hasSlot } from '../../utils';
import ButtonSlotProvider from './context';
import ButtonIcon from './slots/icon';
import ButtonText from './slots/text';
import type { ButtonProps } from './types';

export * from './styles';
export * from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ButtonRoot({
    text,
    icon,
    children,
    variant = 'primary',
    size = 'small',
    theme = 'light',
    disabled = false,
    onPressIn,
    onPressOut,
    accessibilityState,
    accessibilityRole = 'button',
    styleOverrides,
    ...props
}: ButtonProps) {
    const [pressed, setPressed] = useState(false);

    const effectivePressed = pressed && !disabled;

    const { styles, tokens } = useResolveComponentStyles('Button', {
        influencers: { variant, size, theme },
        states: { disabled, pressed: effectivePressed },
        overrides: styleOverrides,
    });

    return (
        <ButtonSlotProvider
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
        </ButtonSlotProvider>
    );
}

const Button = Object.assign(ButtonRoot, {
    Text: ButtonText,
    Icon: ButtonIcon,
});

export default Button;
