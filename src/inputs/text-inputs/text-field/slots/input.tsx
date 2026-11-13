import type { StyleProp, TextStyle } from 'react-native';
import { AnimatedTextInput } from '../../../../lib';
import { useSlotContext } from '../context';

/** Native input props are set on the root; the slot only positions/styles it. */
export type TextFieldInputProps = {
    style?: StyleProp<TextStyle>;
};

export function TextFieldInput({ style }: TextFieldInputProps) {
    const { styles, inputProps } = useSlotContext('TextField.Input');
    return <AnimatedTextInput {...inputProps} style={[styles.input, style]} />;
}
