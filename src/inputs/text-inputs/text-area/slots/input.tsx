import type { StyleProp, TextStyle } from 'react-native';
import { AnimatedTextInput } from '../../../../lib';
import { useSlotContext } from '../context';

/** Native input props are set on the root; the slot only positions/styles it. */
export type TextAreaInputProps = {
    style?: StyleProp<TextStyle>;
};

export function TextAreaInput({ style }: TextAreaInputProps) {
    const { styles, inputProps, inputHeight } =
        useSlotContext('TextArea.Input');
    return (
        <AnimatedTextInput
            {...inputProps}
            style={[styles.input, { height: inputHeight }, style]}
        />
    );
}
