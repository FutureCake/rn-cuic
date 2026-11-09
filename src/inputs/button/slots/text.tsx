import Animated from 'react-native-reanimated';
import type { UseButtonContext } from '../context';
import type { ButtonTextProps } from '../types';

export function createButtonText(useButtonContext: UseButtonContext) {
    return function ButtonText({ style, ...props }: ButtonTextProps) {
        const { styles } = useButtonContext('Button.Text');
        return <Animated.Text {...props} style={[styles.text, style]} />;
    };
}
