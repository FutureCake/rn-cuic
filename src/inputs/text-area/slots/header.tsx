import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ResolvedComponentTokens } from '../../../providers-and-hooks';
import { useSlotContext } from '../context';
import type { TextAreaStyleDefinition } from '../types';

export type TextAreaHeaderRenderProps = {
    tokens: ResolvedComponentTokens<TextAreaStyleDefinition>;
    style: StyleProp<TextStyle>;
};

export type TextAreaHeaderProps = Omit<TextProps, 'children'> & {
    /** A render function receives the resolved tokens and slot style. */
    children?: ReactNode | ((props: TextAreaHeaderRenderProps) => ReactNode);
};

export function TextAreaHeader({
    children,
    style,
    ...props
}: TextAreaHeaderProps) {
    const { styles, tokens } = useSlotContext('TextArea.Header');

    if (typeof children === 'function') {
        return <>{children({ tokens, style: [styles.header, style] })}</>;
    }

    return (
        <Animated.Text {...props} style={[styles.header, style]}>
            {children}
        </Animated.Text>
    );
}
