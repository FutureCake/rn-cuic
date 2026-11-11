import type { ReactNode } from 'react';
import type { ImageProps, ImageStyle, StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ResolvedComponentTokens } from '../../../providers-and-hooks';
import { useSlotContext } from '../context';
import type { ChipStyleDefinition } from '../types';

export type ChipIconRenderProps = {
    tokens: ResolvedComponentTokens<ChipStyleDefinition>;
    style: StyleProp<ImageStyle>;
    selected: boolean;
    disabled: boolean;
};

export type ChipIconProps =
    | (Omit<ImageProps, 'children'> & {
          children?: never;
      })
    | {
          source?: never;
          children: ReactNode | ((props: ChipIconRenderProps) => ReactNode);
          style?: StyleProp<ImageStyle>;
      };

export function ChipIcon({ source, children, style, ...props }: ChipIconProps) {
    const { styles, tokens, selected, disabled } = useSlotContext('Chip.Icon');

    if (typeof children === 'function') {
        return (
            <>
                {children({
                    tokens,
                    style: [styles.icon, style],
                    selected,
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
