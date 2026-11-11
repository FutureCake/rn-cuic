import type { TextProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSlotContext } from '../context';

export type ButtonTextProps = TextProps;

export function ButtonText({ style, ...props }: ButtonTextProps) {
    const { styles } = useSlotContext('Button.Text');
    return <Animated.Text {...props} style={[styles.text, style]} />;
}
