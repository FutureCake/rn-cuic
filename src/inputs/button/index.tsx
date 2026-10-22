import { useEffect, useState } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { useResolveComponentStyles } from 'rn-cuic';
import type { ButtonSize, ButtonVariant, ThemeMode } from './styles';

export * from './styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ButtonProps extends Omit<
  PressableProps,
  'children' | 'style'
> {
  text: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  theme?: ThemeMode;
}

export default function Button({
  text,
  variant = 'rounded',
  size = 'medium',
  theme = 'light',
  disabled = false,
  onPressIn,
  onPressOut,
  accessibilityState,
  accessibilityRole = 'button',
  ...props
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const isDisabled = disabled === true;
  useEffect(() => {
    if (isDisabled) {
      setPressed(false);
    }
  }, [isDisabled]);

  const styles = useResolveComponentStyles('Button', {
    influencers: { variant, size, theme },
    states: { disabled: isDisabled, pressed: pressed && !isDisabled },
  });

  return (
    <AnimatedPressable
      {...props}
      disabled={isDisabled}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ ...accessibilityState, disabled: isDisabled }}
      onPressIn={(event) => {
        setPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        onPressOut?.(event);
      }}
      style={styles.container}
    >
      <Animated.Text style={styles.text}>{text}</Animated.Text>
    </AnimatedPressable>
  );
}
