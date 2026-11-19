import Animated from 'react-native-reanimated';
import type { IconBuilderOptions, IconProps } from './types';

/**
 * Bind shared behavior once, at factory creation. The icon is a pure visual:
 * a tinted square image whose size and color come from the resolved tokens.
 */
export function createIcon<Size extends string, Theme extends string>({
    defaults,
    useStyles,
    useTheme,
}: IconBuilderOptions<Size, Theme>) {
    return function Icon({
        size = defaults.size,
        theme: themeProp,
        style,
        styleOverrides,
        accessibilityRole = 'image',
        ...props
    }: IconProps<Size, Theme>) {
        const { theme: ambientTheme } = useTheme();
        const theme = themeProp ?? ambientTheme;
        const { styles } = useStyles({
            influences: { size, theme },
            overrides: {
                ...styleOverrides,
                icon: [styleOverrides?.icon, style],
            },
        });

        return (
            <Animated.Image
                accessibilityRole={accessibilityRole}
                {...props}
                style={styles.icon}
            />
        );
    };
}
