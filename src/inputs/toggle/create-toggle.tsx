import Animated from 'react-native-reanimated';
import { AnimatedPressable } from '../../lib';
import type { ToggleBuilderOptions, ToggleProps } from './types';

/**
 * Bind shared behavior once, at factory creation. The toggle is controlled:
 * it renders the `active` prop and requests changes through `onChange`.
 */
export function createToggle<Theme extends string>({
    useStyles,
    useTheme,
}: ToggleBuilderOptions<Theme>) {
    return function Toggle({
        active,
        onChange,
        theme: themeProp,
        disabled = false,
        onPress,
        accessibilityState,
        accessibilityRole = 'switch',
        styleOverrides,
        ...props
    }: ToggleProps<Theme>) {
        const { theme: ambientTheme } = useTheme();
        const theme = themeProp ?? ambientTheme;
        const { styles } = useStyles({
            influences: { theme },
            states: { active, disabled },
            overrides: styleOverrides,
        });

        return (
            <AnimatedPressable
                {...props}
                disabled={disabled}
                accessibilityRole={accessibilityRole}
                accessibilityState={{
                    ...accessibilityState,
                    checked: active,
                    disabled,
                }}
                onPress={(event) => {
                    onPress?.(event);
                    onChange?.(!active);
                }}
                style={styles.container}
            >
                <Animated.View style={styles.indicator} />
            </AnimatedPressable>
        );
    };
}
