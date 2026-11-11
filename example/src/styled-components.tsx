import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
    Button,
    StylesProvider,
    Switch,
    TextField,
    Toggle,
    useTheme,
} from 'rn-cuic';

const frequencies = [
    { title: 'Daily', value: 'daily' },
    { title: 'Weekly', value: 'weekly' },
    { title: 'Monthly', value: 'monthly' },
];

/** The library exactly as it ships: default preset components and themes. */
export default function StyledComponentsScreen() {
    return (
        <StylesProvider>
            <Showcase />
        </StylesProvider>
    );
}

function Showcase() {
    const { theme, setTheme } = useTheme();
    const dark = theme === 'dark';

    const [frequency, setFrequency] = useState('daily');
    const [email, setEmail] = useState('');

    return (
        <ScrollView
            style={[
                styles.screen,
                { backgroundColor: dark ? '#111111' : '#ffffff' },
            ]}
            contentContainerStyle={styles.container}
        >
            <View style={styles.row}>
                <Text style={[styles.label, dark && styles.labelDark]}>
                    Dark theme
                </Text>
                <Toggle
                    active={dark}
                    onChange={(next) => setTheme(next ? 'dark' : 'light')}
                />
            </View>

            <Switch
                options={frequencies}
                value={frequency}
                onChange={setFrequency}
            />

            <TextField
                header="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                feedback="We never share your email."
                validation={{
                    showFeedbackOn: 'blur',
                    validator: (text) =>
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
                            ? { valid: true }
                            : {
                                  valid: false,
                                  variant: 'error',
                                  message: 'Enter a valid email address.',
                              },
                }}
            />

            <Button
                text="Subscribe"
                onPress={() => console.log('subscribe', { email, frequency })}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        gap: 24,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 16,
        color: '#111111',
    },
    labelDark: {
        color: '#ffffff',
    },
});
