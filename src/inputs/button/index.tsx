import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useResolveComponentStyles } from 'rn-cuic';
import type { ResolvedComponentResult } from '../../providers-and-hooks';
import { createSlotContext, hasSlot } from '../../utils';
import type {
    ButtonIconProps,
    ButtonProps,
    ButtonStyleDefinition,
    ButtonTextProps,
} from './types';

export * from './styles';
export * from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonContextValue = ResolvedComponentResult<ButtonStyleDefinition> & {
    pressed: boolean;
    disabled: boolean;
};

const { Provider: ButtonSlotProvider, useSlotContext: useButtonContext } =
    createSlotContext<ButtonContextValue>('Button');

function ButtonText({ style, ...props }: ButtonTextProps) {
    const { styles } = useButtonContext('Button.Text');
    return <Animated.Text {...props} style={[styles.text, style]} />;
}

function ButtonIcon({ source, children, style, ...props }: ButtonIconProps) {
    const { styles, tokens, pressed, disabled } =
        useButtonContext('Button.Icon');

    if (typeof children === 'function') {
        return (
            <>
                {children({
                    tokens,
                    style: [styles.icon, style],
                    pressed,
                    disabled,
                })}
            </>
        );
    }

    if (source === undefined) {
        return <>{children}</>;
    }

    return (
        <Animated.Image
            accessible={false}
            {...props}
            source={source}
            style={[styles.icon, style]}
        />
    );
}

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
    useEffect(() => {
        if (disabled) {
            setPressed(false);
        }
    }, [disabled]);

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
