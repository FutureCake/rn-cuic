import Animated from 'react-native-reanimated';
import { Box } from '../../layouts/box';
import type { SurfaceBuilderOptions, SurfaceProps } from './types';

/**
 * Bind shared behavior once, at factory creation. The surface is a pure
 * visual: a themed container whose fill, border and shadow come from the
 * resolved tokens. `color`/`radius` override those tokens per instance;
 * `padding` wraps children in a Box.
 */
export function createSurface<
    Variant extends string,
    Elevation extends string,
    Theme extends string,
>({
    defaults,
    useStyles,
    useTheme,
}: SurfaceBuilderOptions<Variant, Elevation, Theme>) {
    return function Surface({
        variant = defaults.variant,
        elevation = defaults.elevation,
        theme: themeProp,
        color,
        radius,
        padding,
        style,
        styleOverrides,
        children,
        accessibilityRole = 'none',
        ...props
    }: SurfaceProps<Variant, Elevation, Theme>) {
        const { theme: ambientTheme } = useTheme();
        const theme = themeProp ?? ambientTheme;
        const { styles } = useStyles({
            influences: { variant, elevation, theme },
            overrides: {
                ...styleOverrides,
                surface: [
                    color !== undefined && { backgroundColor: color },
                    radius !== undefined && { borderRadius: radius },
                    styleOverrides?.surface,
                    style,
                ],
            },
        });

        return (
            <Animated.View
                accessibilityRole={accessibilityRole}
                {...props}
                style={styles.surface}
            >
                {padding === undefined ? (
                    children
                ) : (
                    <Box padding={padding}>{children}</Box>
                )}
            </Animated.View>
        );
    };
}
