import { useState } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ResolvedComponentResult } from '../../providers-and-hooks';
import { createSlotContext } from '../../utils/create-slot-context';
import { hasSlot } from '../../utils/has-slot';
import type {
    ButtonBuilderOptions,
    ButtonIconProps,
    ButtonProps,
    ButtonStyleDefinition,
    ButtonTextProps,
} from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Fixed Button tokens/slots: parts can share the default-generic contract. */
type ButtonContextValue = ResolvedComponentResult<ButtonStyleDefinition> & {
    pressed: boolean;
    disabled: boolean;
};

/**
 * Bind shared behavior and stable compound parts once, at factory creation.
 * Each configured Button family owns its parts and their nearest-root context.
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
    const { ContextProvider, useSlotContext } =
        createSlotContext<ButtonContextValue>('Button');

    function ButtonText({ style, ...props }: ButtonTextProps) {
        const { styles } = useSlotContext('Button.Text');
        return <Animated.Text {...props} style={[styles.text, style]} />;
    }

    function ButtonIcon({
        source,
        children,
        style,
        ...props
    }: ButtonIconProps) {
        const { styles, tokens, pressed, disabled } =
            useSlotContext('Button.Icon');

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
