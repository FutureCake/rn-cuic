import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomComponentsScreen from './custom-components';
import StyledComponentsScreen from './styled-components';

const screens = [
    { key: 'styled', title: 'Default preset' },
    { key: 'custom', title: 'Custom createUI' },
] as const;

type ScreenKey = (typeof screens)[number]['key'];

export default function App() {
    const [screen, setScreen] = useState<ScreenKey>('styled');

    return (
        <GestureHandlerRootView style={styles.root}>
            <View style={styles.tabs}>
                {screens.map(({ key, title }) => (
                    <Pressable
                        key={key}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: screen === key }}
                        onPress={() => setScreen(key)}
                        style={[styles.tab, screen === key && styles.tabActive]}
                    >
                        <Text
                            style={[
                                styles.tabTitle,
                                screen === key && styles.tabTitleActive,
                            ]}
                        >
                            {title}
                        </Text>
                    </Pressable>
                ))}
            </View>
            {screen === 'styled' ? (
                <StyledComponentsScreen />
            ) : (
                <CustomComponentsScreen />
            )}
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    tabs: {
        flexDirection: 'row',
        gap: 8,
        paddingTop: 64,
        paddingHorizontal: 24,
        paddingBottom: 12,
        backgroundColor: '#f4f4f5',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: '#111111',
    },
    tabTitle: {
        fontSize: 14,
        color: '#111111',
    },
    tabTitleActive: {
        color: '#ffffff',
    },
});
