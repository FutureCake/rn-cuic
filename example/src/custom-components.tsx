import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
    buttonStyleDefinition,
    createUI,
    defineButtonStyles,
    switchStyleDefinition,
    textFieldStyleDefinition,
    toggleStyleDefinition,
} from 'rn-cuic';

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
            thetiary: ({ theme }) => ({
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

// An isolated family: its provider/components never affect the default preset.
const { Button, Toggle, Switch, TextField, StylesProvider, useTheme } =
    createUI({
        theme: 'light',
        Button: {
            definition: customButtonDefinition,
            defaults: { variant: 'primary', size: 'large' },
        },
        Toggle: { definition: toggleStyleDefinition },
        Switch: { definition: switchStyleDefinition },
        TextField: {
            definition: textFieldStyleDefinition,
            defaults: { feedbackVariant: 'info' },
        },
    });

const frequencies = [
    { title: 'Daily', value: 'daily' },
    { title: 'Weekly', value: 'weekly' },
    { title: 'Monthly', value: 'monthly' },
];

/** The same showcase, rendered by a createUI family with custom definitions. */
export default function CustomComponentsScreen() {
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
                variant="thetiary"
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
