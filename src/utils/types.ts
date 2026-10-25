import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type StyleOverrides<T extends string> = Partial<
    Record<T, StyleProp<ViewStyle | TextStyle>>
>;
