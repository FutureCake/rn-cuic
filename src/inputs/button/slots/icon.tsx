import type { ReactNode } from 'react';
import type { ImageProps, ImageStyle, StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ResolvedComponentTokens } from '../../../providers-and-hooks';
import { useSlotContext } from '../context';
import type { ButtonStyleDefinition } from '../types';

export type ButtonIconRenderProps = {
    tokens: ResolvedComponentTokens<ButtonStyleDefinition>;
    style: StyleProp<ImageStyle>;
    pressed: boolean;
    disabled: boolean;
};

export type ButtonIconProps =
    | (Omit<ImageProps, 'children'> & {
          children?: never;
      })
    | {
          source?: never;
          children: ReactNode | ((props: ButtonIconRenderProps) => ReactNode);
          style?: StyleProp<ImageStyle>;
      };

export function ButtonIcon({
    source,
    children,
    style,
    ...props
}: ButtonIconProps) {
    const { styles, tokens, pressed, disabled } = useSlotContext('Button.Icon');

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
