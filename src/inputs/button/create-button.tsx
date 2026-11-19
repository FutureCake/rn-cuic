import { usePressedState } from '../../shared/hooks/use-pressed-state';
import { AnimatedPressable } from '../../shared/libs/reanimated';
import { hasSlot } from '../../shared/utils/has-slot';
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
        const press = usePressedState({ disabled, onPressIn, onPressOut });
        const { styles, tokens } = useStyles({
            influences: { variant, size, theme },
            states: { disabled, pressed: press.pressed },
            overrides: styleOverrides,
        });

        return (
            <ContextProvider
                value={{ styles, tokens, pressed: press.pressed, disabled }}
            >
                <AnimatedPressable
                    {...props}
                    disabled={disabled}
                    accessibilityRole={accessibilityRole}
                    accessibilityState={{ ...accessibilityState, disabled }}
                    onPressIn={press.onPressIn}
                    onPressOut={press.onPressOut}
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
