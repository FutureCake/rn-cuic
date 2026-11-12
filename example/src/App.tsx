import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    buttonFactory,
    buttonStyleDefinition,
    defineButtonStyles,
} from 'rn-cuic/button';
import { chipFactory } from 'rn-cuic/chip';
import { createUI } from 'rn-cuic/core';
import { switchFactory } from 'rn-cuic/switch';
import { textFieldFactory } from 'rn-cuic/text-field';
import { toggleFactory } from 'rn-cuic/toggle';

const brand = {
    light: { main: '#4f46e5', pressed: '#3730a3', on: '#ffffff' },
    dark: { main: '#818cf8', pressed: '#a5b4fc', on: '#1e1b4b' },
} as const;

/** Preset button reskinned: indigo brand colors and a fully rounded shape. */
const customButtonDefinition = defineButtonStyles({
    defaultTokens: {
        ...buttonStyleDefinition.defaultTokens,
        radius: 999,
        bgColor: brand.light.main,
        textColor: brand.light.on,
        iconColor: brand.light.on,
    },
    influenceResolvers: {
        theme: {
            light: {
                bgColor: brand.light.main,
                textColor: brand.light.on,
                iconColor: brand.light.on,
            },
            dark: {
                bgColor: brand.dark.main,
                textColor: brand.dark.on,
                iconColor: brand.dark.on,
            },
        },
        variant: {
            primary: {},
            secondary: ({ theme }) => ({
                bgColor: 'transparent',
                textColor: brand[theme].main,
                iconColor: brand[theme].main,
            }),
            tertiary: ({ theme }) => ({
                bgColor: 'transparent',
                textColor: brand[theme].main,
                iconColor: brand[theme].main,
            }),
        },
        size: {
            small: { paddingX: 16, paddingY: 8, fontSize: 15, iconSize: 18 },
            large: { paddingX: 24, paddingY: 14, fontSize: 20, iconSize: 24 },
            xlarge: { paddingX: 32, paddingY: 18, fontSize: 24, iconSize: 28 },
        },
    },
    stateResolvers: {
        pressed: ({ theme, variant }) =>
            variant === 'primary'
                ? { bgColor: brand[theme].pressed }
                : {
                      textColor: brand[theme].pressed,
                      iconColor: brand[theme].pressed,
                  },
        disabled: {
            bgColor: '#c7d2fe',
            textColor: '#eef2ff',
            iconColor: '#eef2ff',
        },
    },
    slotStyles: buttonStyleDefinition.slotStyles,
    transition: buttonStyleDefinition.transition,
});

// One selective family: a custom Button definition, presets for the rest.
// Importing only the factories the app uses keeps the rest of the library
// out of the bundle.
const { Button, Chip, Toggle, Switch, TextField, StylesProvider, useTheme } =
    createUI({
        theme: 'light',
        components: {
            Button: buttonFactory({
                definition: customButtonDefinition,
                defaults: { variant: 'tertiary', size: 'large' },
            }),
            Chip: chipFactory(),
            Toggle: toggleFactory(),
            Switch: switchFactory(),
            TextField: textFieldFactory(),
        },
    });

const frequencies = [
    { title: 'Daily', value: 'daily' },
    { title: 'Weekly', value: 'weekly' },
    { title: 'Monthly', value: 'monthly' },
];

const topics = ['News', 'Sports', 'Tech'];

export default function App() {
    return (
        <GestureHandlerRootView style={styles.root}>
            <StylesProvider>
                <Showcase />
            </StylesProvider>
        </GestureHandlerRootView>
    );
}

function Showcase() {
    const { theme, setTheme } = useTheme();
    const dark = theme === 'dark';

    const [frequency, setFrequency] = useState('daily');
    const [selectedTopics, setSelectedTopics] = useState(['News']);
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

            <View style={styles.chips}>
                {topics.map((topic) => (
                    <Chip
                        key={topic}
                        text={topic}
                        selected={selectedTopics.includes(topic)}
                        onChange={(next) =>
                            setSelectedTopics((current) =>
                                next
                                    ? [...current, topic]
                                    : current.filter((t) => t !== topic)
                            )
                        }
                    />
                ))}
            </View>

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
                variant="tertiary"
                text="Subscribe"
                onPress={() => console.log('subscribe', { email, frequency })}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
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
    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    label: {
        fontSize: 16,
        color: '#111111',
    },
    labelDark: {
        color: '#ffffff',
    },
});
