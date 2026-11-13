import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { AnimatedPressable } from '../../../lib';
import type { ResolvedComponentTokens } from '../../../providers-and-hooks';
import { useSlotContext } from '../context';
import type { SwitchStyleDefinition } from '../types';

export type SwitchOptionRenderProps = {
    title: string;
    selected: boolean;
    tokens: ResolvedComponentTokens<SwitchStyleDefinition>;
    style: StyleProp<TextStyle>;
};

export type SwitchOptionProps<Value = unknown> = {
    title: string;
    value: Value;
    /** Option (pressable) style; the label is styled via render props. */
    style?: StyleProp<ViewStyle>;
    /** Replaces the default label; the pressable surface is kept. */
    children?: (props: SwitchOptionRenderProps) => ReactNode;
};

export function SwitchOption<Value>({
    title,
    value,
    style,
    children,
}: SwitchOptionProps<Value>) {
    const {
        styles,
        tokens,
        disabled,
        selectedIndex,
        settledIndex,
        indexOf,
        select,
        registerOption,
    } = useSlotContext('Switch.Option');
    const index = indexOf(value);
    const selected = index === settledIndex;

    const animatedTextStyle = useAnimatedStyle(
        () => ({
            color: interpolateColor(
                selectedIndex.value,
                [index - 1, index, index + 1],
                [
                    tokens.textColor as string,
                    tokens.activeTextColor as string,
                    tokens.textColor as string,
                ]
            ),
        }),
        [index, tokens.textColor, tokens.activeTextColor]
    );
    const textStyle = [
        styles.optionText,
        animatedTextStyle,
    ] as StyleProp<TextStyle>;

    return (
        <AnimatedPressable
            disabled={disabled}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled }}
            style={[styles.option, style]}
            onLayout={(event) => {
                const { x, width } = event.nativeEvent.layout;
                registerOption(index, { x, width });
            }}
            onPress={() => select(value)}
        >
            {children !== undefined ? (
                children({ title, selected, tokens, style: textStyle })
            ) : (
                <Animated.Text style={textStyle}>{title}</Animated.Text>
            )}
        </AnimatedPressable>
    );
}
