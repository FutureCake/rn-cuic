import Animated from 'react-native-reanimated';
import { useButtonContext } from '../context';
import type { ButtonTextProps } from '../types';

export default function ButtonText({ style, ...props }: ButtonTextProps) {
    const { styles } = useButtonContext('Button.Text');
    return <Animated.Text {...props} style={[styles.text, style]} />;
}
