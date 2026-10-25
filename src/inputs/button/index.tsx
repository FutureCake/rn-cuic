import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useResolveComponentStyles } from 'rn-cuic';
import type { ButtonProps } from './types';

export * from './styles';
export * from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Button({
    text,
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
    useEffect(() => {
        if (disabled) {
            setPressed(false);
        }
    }, [disabled]);

    const styles = useResolveComponentStyles('Button', {
        influencers: { variant, size, theme },
        states: { disabled, pressed: pressed && !disabled },
        overrides: styleOverrides,
    });

    return (
        <AnimatedPressable
            {...props}
            disabled={disabled}
            accessibilityRole={accessibilityRole}
            accessibilityState={{ ...accessibilityState, disabled: disabled }}
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
            <Animated.Text style={styles.text}>{text}</Animated.Text>
        </AnimatedPressable>
    );
}
