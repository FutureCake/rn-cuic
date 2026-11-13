import { Pressable, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';

/**
 * Shared animated native wrappers. `createAnimatedComponent` creates a new
 * component class per call, so each wrapper is created once and reused by
 * every component in the library.
 */
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
