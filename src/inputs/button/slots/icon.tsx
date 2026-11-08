import { Animated } from 'react-native';
import { useButtonContext } from '../context';
import type { ButtonIconProps } from '../types';

export default function ButtonIcon({
    source,
    children,
    style,
    ...props
}: ButtonIconProps) {
    const { styles, tokens, pressed, disabled } =
        useButtonContext('Button.Icon');

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
