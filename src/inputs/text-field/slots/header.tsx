import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ResolvedComponentTokens } from '../../../providers-and-hooks';
import { useSlotContext } from '../context';
import type { TextFieldStyleDefinition } from '../types';

export type TextFieldHeaderRenderProps = {
    tokens: ResolvedComponentTokens<TextFieldStyleDefinition>;
    style: StyleProp<TextStyle>;
};

export type TextFieldHeaderProps = Omit<TextProps, 'children'> & {
    /** A render function receives the resolved tokens and slot style. */
    children?: ReactNode | ((props: TextFieldHeaderRenderProps) => ReactNode);
};

export function TextFieldHeader({
    children,
    style,
    ...props
}: TextFieldHeaderProps) {
    const { styles, tokens } = useSlotContext('TextField.Header');

    if (typeof children === 'function') {
        return <>{children({ tokens, style: [styles.header, style] })}</>;
    }

    return (
        <Animated.Text {...props} style={[styles.header, style]}>
            {children}
        </Animated.Text>
    );
}
