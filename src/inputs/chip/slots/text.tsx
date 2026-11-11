import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ResolvedComponentTokens } from '../../../providers-and-hooks';
import { useSlotContext } from '../context';
import type { ChipStyleDefinition } from '../types';

export type ChipTextRenderProps = {
    tokens: ResolvedComponentTokens<ChipStyleDefinition>;
    style: StyleProp<TextStyle>;
    selected: boolean;
    disabled: boolean;
};

export type ChipTextProps = Omit<TextProps, 'children'> & {
    children?: ReactNode | ((props: ChipTextRenderProps) => ReactNode);
};

export function ChipText({ children, style, ...props }: ChipTextProps) {
    const { styles, tokens, selected, disabled } = useSlotContext('Chip.Text');

    if (typeof children === 'function') {
        return (
            <>
                {children({
                    tokens,
                    style: [styles.text, style],
                    selected,
                    disabled,
                })}
            </>
        );
    }

    return (
        <Animated.Text {...props} style={[styles.text, style]}>
            {children}
        </Animated.Text>
    );
}
