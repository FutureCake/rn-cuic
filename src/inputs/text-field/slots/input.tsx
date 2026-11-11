import { TextInput, type StyleProp, type TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSlotContext } from '../context';

/** Native input props are set on the root; the slot only positions/styles it. */
export type TextFieldInputProps = {
    style?: StyleProp<TextStyle>;
};

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function TextFieldInput({ style }: TextFieldInputProps) {
    const { styles, inputProps } = useSlotContext('TextField.Input');
    return <AnimatedTextInput {...inputProps} style={[styles.input, style]} />;
}
