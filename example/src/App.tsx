import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { createUI } from 'rn-cuic/core';
import {
    buttonFactory,
    buttonStyleDefinition,
    defineButtonStyles,
} from '../../src/components/inputs/button';
import { chipsFactory } from '../../src/components/inputs/chips';
import { switchFactory } from '../../src/components/inputs/switch';
import { textAreaFactory } from '../../src/components/inputs/text-inputs/text-area';
import { textFieldFactory } from '../../src/components/inputs/text-inputs/text-field';
import { toggleFactory } from '../../src/components/inputs/toggle';
import { Box } from '../../src/components/layouts/box';
import { HStack, VStack, ZStack } from '../../src/components/layouts/stacks';
import { bottomSheetFactory } from '../../src/components/overlays/bottom-sheet';
import { modalFactory } from '../../src/components/overlays/modal';
import { iconFactory } from '../../src/components/visuals/icon';
import { surfaceFactory } from '../../src/components/visuals/surface';

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
            s: { paddingX: 16, paddingY: 8, fontSize: 15, iconSize: 18 },
            l: { paddingX: 24, paddingY: 14, fontSize: 20, iconSize: 24 },
            xl: { paddingX: 32, paddingY: 18, fontSize: 24, iconSize: 28 },
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
const {
    BottomSheet,
    Button,
    Chips,
    Icon,
    Modal,
    Surface,
    Toggle,
    Switch,
    TextField,
    TextArea,
    StylesProvider,
    useTheme,
} = createUI({
    theme: 'light',
    components: {
        BottomSheet: bottomSheetFactory(),
        Button: buttonFactory({
            definition: customButtonDefinition,
            defaults: { variant: 'tertiary', size: 'l' },
        }),
        Chips: chipsFactory(),
        Icon: iconFactory(),
        Modal: modalFactory(),
        Surface: surfaceFactory(),
        Toggle: toggleFactory(),
        Switch: switchFactory(),
        TextField: textFieldFactory(),
        TextArea: textAreaFactory(),
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
            <KeyboardProvider>
                <StylesProvider>
                    <Showcase />
                </StylesProvider>
            </KeyboardProvider>
        </GestureHandlerRootView>
    );
}

function Showcase() {
    const { theme, setTheme } = useTheme();
    const dark = theme === 'dark';

    const [frequency, setFrequency] = useState('daily');
    const [selectedTopics, setSelectedTopics] = useState(['News']);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sheetOpen, setSheetOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <View
            style={[
                styles.screen,
                { backgroundColor: dark ? '#111111' : '#ffffff' },
            ]}
        >
            <ScrollView
                style={styles.screen}
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

                <Chips
                    selectionMode="multi"
                    header="Topics"
                    feedback="Pick what lands in your inbox."
                    options={topics.map((topic) => ({
                        title: topic,
                        value: topic,
                    }))}
                    value={selectedTopics}
                    onChange={(next) => setSelectedTopics(next)}
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

                <TextArea
                    header="Message"
                    placeholder="Anything you want to add?"
                    value={message}
                    onChangeText={setMessage}
                    numLines={3}
                    maxLines={8}
                    feedback="Grows with your message, up to 8 lines."
                />

                <HStack align="center" justify="space-between">
                    {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
                        <Icon
                            key={size}
                            size={size}
                            source={require('../assets/android-icon-monochrome.png')}
                        />
                    ))}
                </HStack>

                <Box padding={{ x: 24, top: 8, bottom: 16 }} style={styles.box}>
                    <Text>Box with x + top/bottom padding</Text>
                </Box>

                <HStack spacing={12}>
                    {(['framed', 'contained', 'neutral'] as const).map(
                        (variant) => (
                            <Surface
                                key={variant}
                                variant={variant}
                                elevation="first"
                                padding={12}
                            >
                                <Text>{variant}</Text>
                            </Surface>
                        )
                    )}
                </HStack>

                <ZStack align="center" offset={{ x: 12, y: 8 }}>
                    {['#c7d2fe', '#a5b4fc', '#818cf8'].map((color) => (
                        <View
                            key={color}
                            style={[styles.layer, { backgroundColor: color }]}
                        />
                    ))}
                </ZStack>

                <VStack spacing={12}>
                    <Button
                        text="Open bottom sheet"
                        onPress={() => setSheetOpen(true)}
                    />

                    <Button
                        text="Open modal"
                        onPress={() => setModalOpen(true)}
                    />
                </VStack>
            </ScrollView>

            {sheetOpen && (
                <BottomSheet
                    minimizedClosable={false}
                    onClose={() => setSheetOpen(false)}
                    showHandleOnMinimized
                >
                    <BottomSheet.Minimized>
                        <Text style={[styles.label, dark && styles.labelDark]}>
                            Quick note — tap to expand
                        </Text>
                    </BottomSheet.Minimized>
                    <BottomSheet.Content>
                        <TextField
                            header="Note"
                            placeholder="The sheet rises with the keyboard…"
                        />
                        <Text style={[styles.label, dark && styles.labelDark]}>
                            Swipe down to minimize, further to close.
                        </Text>
                    </BottomSheet.Content>
                </BottomSheet>
            )}

            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                    <Text style={[styles.label, dark && styles.labelDark]}>
                        A centered modal card. Press outside to close.
                    </Text>
                    <Button text="Done" onPress={() => setModalOpen(false)} />
                </Modal>
            )}
        </View>
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
    label: {
        fontSize: 16,
        color: '#111111',
    },
    labelDark: {
        color: '#ffffff',
    },
    box: {
        borderRadius: 12,
        backgroundColor: '#eef2ff',
    },
    layer: {
        width: 96,
        height: 64,
        borderRadius: 12,
    },
});
