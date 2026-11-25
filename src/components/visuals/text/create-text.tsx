import { createContext, useContext, useMemo } from 'react';
import type { ColorValue } from 'react-native';
import Animated from 'react-native-reanimated';
import type { TextBuilderOptions, TextProps } from './types';

/** The effective appearance a nested Text inherits from its nearest parent. */
type InheritedText = {
    variant: string;
    weight: string | undefined;
    theme: string;
    color: ColorValue | undefined;
};

// Module-level like slot contexts: nesting is shared across createUI families.
const InheritedTextContext = createContext<InheritedText | null>(null);

/**
 * Bind shared behavior once, at factory creation. Text resolves its type
 * scale (variant + weight), font role and color from the definition; nested
 * Text inherits whatever its parent resolved unless it sets its own props.
 */
export function createText<
    Variant extends string,
    Weight extends string,
    Theme extends string,
>({
    defaults,
    useStyles,
    useTheme,
}: TextBuilderOptions<Variant, Weight, Theme>) {
    return function Text({
        variant: variantProp,
        weight: weightProp,
        theme: themeProp,
        color: colorProp,
        style,
        styleOverrides,
        ...props
    }: TextProps<Variant, Weight, Theme>) {
        const parent = useContext(InheritedTextContext);
        const { theme: ambientTheme } = useTheme();
        // A parent from another createUI family may use other names; unknown
        // names warn in the resolver and fall back to the defaults.
        const variant =
            variantProp ??
            (parent?.variant as Variant | undefined) ??
            defaults.variant;
        const weight = weightProp ?? (parent?.weight as Weight | undefined);
        const theme =
            themeProp ?? (parent?.theme as Theme | undefined) ?? ambientTheme;
        const color = colorProp ?? parent?.color;

        const { styles } = useStyles({
            influences: { theme, variant, weight },
            overrides: {
                ...styleOverrides,
                text: [
                    color !== undefined && { color },
                    styleOverrides?.text,
                    style,
                ],
            },
        });
        const inherited = useMemo(
            () => ({ variant, weight, theme, color }),
            [variant, weight, theme, color]
        );

        return (
            <InheritedTextContext.Provider value={inherited}>
                <Animated.Text {...props} style={styles.text} />
            </InheritedTextContext.Provider>
        );
    };
}
