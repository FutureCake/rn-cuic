import type { ReactNode } from 'react';
import type { ImageSourcePropType, StyleProp, TextStyle } from 'react-native';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ResolvedComponentTokens } from '../../../providers-and-hooks';
import { useSlotContext } from '../context';
import type { ChipStyleDefinition } from '../types';

export type ChipCloseRenderProps = {
    tokens: ResolvedComponentTokens<ChipStyleDefinition>;
    style: StyleProp<TextStyle>;
    selected: boolean;
    disabled: boolean;
};

export type ChipCloseProps = {
    /** Replaces the default × glyph; sized and tinted from tokens. */
    source?: ImageSourcePropType;
    /** Overrides the root's onClose for this slot. */
    onPress?: () => void;
    /** Defaults to "Remove". */
    accessibilityLabel?: string;
    /** Applied to the default × glyph. */
    style?: StyleProp<TextStyle>;
    children?: ReactNode | ((props: ChipCloseRenderProps) => ReactNode);
};

export function ChipClose({
    source,
    onPress,
    accessibilityLabel = 'Remove',
    style,
    children,
}: ChipCloseProps) {
    const { styles, tokens, selected, disabled, onClose } =
        useSlotContext('Chip.Close');

    let content: ReactNode;
    if (typeof children === 'function') {
        content = children({
            tokens,
            style: [styles.close, style],
            selected,
            disabled,
        });
    } else if (children !== undefined) {
        content = children;
    } else if (source !== undefined) {
        content = (
            <Animated.Image
                accessible={false}
                source={source}
                style={{
                    width: tokens.closeSize,
                    height: tokens.closeSize,
                    tintColor: tokens.closeColor,
                    resizeMode: 'contain',
                }}
            />
        );
    } else {
        content = (
            <Animated.Text style={[styles.close, style]}>✕</Animated.Text>
        );
    }

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ disabled }}
            disabled={disabled}
            hitSlop={8}
            onPress={onPress ?? onClose}
        >
            {content}
        </Pressable>
    );
}
