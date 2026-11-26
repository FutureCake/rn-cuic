import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Box } from 'rn-cuic/box';
import { createUI } from 'rn-cuic/core';
import { buttonFactory } from '../../src/components/inputs/button';
import { chipFactory } from '../../src/components/inputs/chip';
import { chipsFactory } from '../../src/components/inputs/chips';
import { switchFactory } from '../../src/components/inputs/switch';
import { textAreaFactory } from '../../src/components/inputs/text-inputs/text-area';
import { textFieldFactory } from '../../src/components/inputs/text-inputs/text-field';
import { toggleFactory } from '../../src/components/inputs/toggle';
import { HStack, VStack, ZStack } from '../../src/components/layouts/stacks';
import { bottomSheetFactory } from '../../src/components/overlays/bottom-sheet';
import { modalFactory } from '../../src/components/overlays/modal';
import { iconFactory } from '../../src/components/visuals/icon';
import { surfaceFactory } from '../../src/components/visuals/surface';
import {
    defineTextStyles,
    textFactory,
} from '../../src/components/visuals/text';

const typePalette = {
    light: { text: '#222222', muted: '#6B6B70' },
    dark: { text: '#F2F2F5', muted: '#A0A0A8' },
} as const;

/**
 * A custom type scale: the preset's four steps plus a `code` variant on a
 * custom `code` font role (declared in createUI `fonts` below).
 */
const customTextDefinition = defineTextStyles({
    defaultTokens: {
        font: 'body',
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
        color: typePalette.light.text,
    },
    influenceResolvers: {
        theme: {
            light: { color: typePalette.light.text },
            dark: { color: typePalette.dark.text },
        },
        variant: {
            title: {
                font: 'heading',
                fontWeight: 700,
                fontSize: 28,
                lineHeight: 34,
            },
            body: {},
            label: { fontWeight: 500, fontSize: 14, lineHeight: 20 },
            caption: ({ theme }) => ({
                fontSize: 12,
                lineHeight: 16,
                color: typePalette[theme].muted,
            }),
            code: { font: 'code', fontSize: 14, lineHeight: 20 },
        },
        weight: {
            regular: { fontWeight: 400 },
            medium: { fontWeight: 500 },
            semibold: { fontWeight: 600 },
            bold: { fontWeight: 700 },
        },
    },
    stateResolvers: {},
    slotStyles: {
        text: (tokens, { font }) => ({
            ...font(tokens.font, tokens.fontWeight),
            fontSize: tokens.fontSize,
            lineHeight: tokens.lineHeight,
            letterSpacing: tokens.letterSpacing,
            color: tokens.color,
        }),
    },
    transition: {
        transitionProperty: ['color', 'fontSize', 'lineHeight'],
        transitionDuration: 499,
    },
});

// One selective family: custom Button and Text definitions, presets for the
// rest.
// Importing only the factories the app uses keeps the rest of the library
// out of the bundle.
const {
    BottomSheet,
    Button,
    Chip,
    Chips,
    Icon,
    Modal,
    Surface,
    Text,
    Toggle,
    Switch,
    TextField,
    TextArea,
    StylesProvider,
    useTheme,
} = createUI({
    theme: 'light',
    // iOS-bundled faces, so the example needs no font assets. Apps load their
    // own fonts (e.g. expo-font) and pass the registered names here.
    // fonts: {
    //     // One face per weight: weights resolve to the nearest face.
    //     body: {
    //         400: 'AvenirNext-Regular',
    //         500: 'AvenirNext-Medium',
    //         600: 'AvenirNext-DemiBold',
    //         700: 'AvenirNext-Bold',
    //     },
    //     // A natively registered family: fontWeight passes through.
    //     heading: 'Georgia',
    //     // A custom role, used by the Text `code` variant.
    //     code: 'Menlo',
    // },
    components: {
        BottomSheet: bottomSheetFactory(),
        Button: buttonFactory(),
        Chip: chipFactory(),
        Chips: chipsFactory(),
        Icon: iconFactory(),
        Modal: modalFactory(),
        Surface: surfaceFactory(),
        Text: textFactory({
            definition: customTextDefinition,
            defaults: { variant: 'body' },
        }),
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

const weights = ['regular', 'medium', 'semibold', 'bold'] as const;

export default function App() {
    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={styles.root}>
                <KeyboardProvider>
                    <StylesProvider>
                        <Showcase />
                    </StylesProvider>
                </KeyboardProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

function Showcase() {
    const { top } = useSafeAreaInsets();
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
                contentContainerStyle={[styles.container, { paddingTop: top }]}
            >
                <View style={styles.row}>
                    <Text>Dark theme</Text>
                    <Toggle
                        active={dark}
                        onChange={(next) => setTheme(next ? 'dark' : 'light')}
                    />
                </View>

                <VStack spacing={8}>
                    <Text variant="title">Typography</Text>
                    <Text>
                        Body copy in Avenir Next with a{' '}
                        <Text weight="bold">bold nested span</Text> that
                        inherits the rest.
                    </Text>
                    <HStack spacing={12}>
                        {weights.map((weight) => (
                            <Text key={weight} weight={weight}>
                                {weight}
                            </Text>
                        ))}
                    </HStack>
                    <Text variant="label">Label</Text>
                    <Text variant="caption">
                        Caption text, muted per theme.
                    </Text>
                    <Text variant="code">createUI({'{ fonts }'})</Text>
                </VStack>

                <Switch
                    options={frequencies}
                    value={frequency}
                    onChange={setFrequency}
                />

                <Chips
                    selectionMode="multi"
                    header="Topics"
                    feedback="Pick what lands in your inbox."
                    value={selectedTopics}
                    onChange={(next) => setSelectedTopics(next)}
                >
                    {topics.map((topic) => (
                        <Chip key={topic} value={topic} text={topic} />
                    ))}
                </Chips>

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
                    <Text theme="light">Box with x + top/bottom padding</Text>
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

                <VStack spacing={16}>
                    <Button
                        icon={require('../assets/cup.png')}
                        variant="solid"
                        shape="hug"
                        size="l"
                        // text="Open bottom sheet"
                        onPress={() => setSheetOpen(true)}
                    />

                    <Button
                        size="l"
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
                        <Text>Quick note — tap to expand</Text>
                    </BottomSheet.Minimized>
                    <BottomSheet.Content>
                        <TextField
                            header="Note"
                            placeholder="The sheet rises with the keyboard…"
                        />
                        <Text>Swipe down to minimize, further to close.</Text>
                    </BottomSheet.Content>
                </BottomSheet>
            )}

            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                    <Text>A centered modal card. Press outside to close.</Text>
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
        paddingBottom: 100,
        gap: 24,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
