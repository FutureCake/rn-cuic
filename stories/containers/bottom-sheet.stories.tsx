import type { Decorator, Meta, StoryObj } from '@storybook/react-native';
import { useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';
import type { BottomSheetProps } from 'rn-cuic';
import { withRenderContainer } from '../helpers/render-container';
import { BottomSheet, Button, TextField } from '../helpers/ui';

/** Gesture + keyboard infrastructure the sheet needs at runtime. */
const withSheetEnvironment: Decorator = (Story) => (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
            <Story />
        </KeyboardProvider>
    </GestureHandlerRootView>
);

const meta = {
    title: 'Containers/BottomSheet',
    component: BottomSheet,
    decorators: [withRenderContainer, withSheetEnvironment],
    args: {
        closeOnPressOutside: true,
        backdrop: false,
        theme: 'light',
        onClose: () => {},
    },
    argTypes: {
        closeOnPressOutside: { control: 'boolean' },
        backdrop: { control: 'boolean' },
        initialHeight: { control: 'number' },
        maxHeight: { control: 'number' },
        minimizedClosable: { control: 'boolean' },
        showHandleOnMinimized: { control: 'boolean' },
        theme: { control: 'select', options: ['light', 'dark'] },
        onClose: { action: 'closed' },
        onExpandedChange: { action: 'expandedChange' },
    },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Mount-controlled wrapper: a button mounts/unmounts the sheet (persistent
 * sheets can only be removed by unmounting), onClose also unmounts it.
 */
function SheetDemo({
    children,
    ...props
}: Partial<BottomSheetProps> & { children?: ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <View style={{ flex: 1 }}>
            <Button
                text={open ? 'Unmount sheet' : 'Open sheet'}
                onPress={() => setOpen(!open)}
            />
            {open && (
                <BottomSheet
                    {...props}
                    onClose={() => {
                        setOpen(false);
                        props.onClose?.();
                    }}
                >
                    {children}
                </BottomSheet>
            )}
        </View>
    );
}

/** Children are slots only; Content is required. */
export const Default: Story = {
    render: (args) => (
        <SheetDemo {...args}>
            <BottomSheet.Content>
                <Text style={{ fontSize: 17, fontWeight: '600' }}>
                    Hello from the sheet
                </Text>
                <Text>
                    Drag the sheet down past a third of its height, fling it, or
                    press outside to dismiss it.
                </Text>
            </BottomSheet.Content>
        </SheetDemo>
    ),
};

/** The scrim is visual only; pressing it still closes via closeOnPressOutside. */
export const WithBackdrop: Story = {
    args: { backdrop: true },
    render: (args) => (
        <SheetDemo {...args}>
            <BottomSheet.Content>
                <Text>A dimmed scrim renders behind this sheet.</Text>
            </BottomSheet.Content>
        </SheetDemo>
    ),
};

/**
 * A Minimized slot keeps the sheet persistent by default: the handle is
 * hidden, tapping the minimized content expands, swiping down returns to
 * the minimized state, the screen behind stays interactive, and only
 * unmounting removes the sheet.
 */
export const Minimized: Story = {
    render: (args) => (
        <SheetDemo {...args}>
            <BottomSheet.Minimized>
                <Text style={{ fontSize: 17, fontWeight: '600' }}>
                    Now playing — tap to expand
                </Text>
            </BottomSheet.Minimized>
            <BottomSheet.Content>
                {Array.from({ length: 12 }, (_, i) => (
                    <Text key={i}>Detail row {i + 1}</Text>
                ))}
            </BottomSheet.Content>
        </SheetDemo>
    ),
};

/**
 * minimizedClosable lets the user dismiss a minimized sheet: a small swipe
 * down settles on the minimized state, a larger swipe or fling closes.
 */
export const MinimizedClosable: Story = {
    args: { minimizedClosable: true },
    render: (args) => (
        <SheetDemo {...args}>
            <BottomSheet.Minimized>
                <Text style={{ fontWeight: '600' }}>
                    Tap to expand, fling down to close
                </Text>
            </BottomSheet.Minimized>
            <BottomSheet.Content>
                {Array.from({ length: 12 }, (_, i) => (
                    <Text key={i}>Detail row {i + 1}</Text>
                ))}
            </BottomSheet.Content>
        </SheetDemo>
    ),
};

/** showHandleOnMinimized restores the handle and swipe-up expansion. */
export const MinimizedWithHandle: Story = {
    args: { showHandleOnMinimized: true },
    render: (args) => (
        <SheetDemo {...args}>
            <BottomSheet.Minimized>
                <Text style={{ fontWeight: '600' }}>
                    Tap or swipe up to expand
                </Text>
            </BottomSheet.Minimized>
            <BottomSheet.Content>
                {Array.from({ length: 12 }, (_, i) => (
                    <Text key={i}>Detail row {i + 1}</Text>
                ))}
            </BottomSheet.Content>
        </SheetDemo>
    ),
};

/** An explicit initialHeight defines the minimized snap without a Minimized slot. */
export const InitialHeight: Story = {
    args: { initialHeight: 180, maxHeight: 500 },
    render: (args) => (
        <SheetDemo {...args}>
            <BottomSheet.Content>
                {Array.from({ length: 16 }, (_, i) => (
                    <Text key={i}>Row {i + 1}</Text>
                ))}
            </BottomSheet.Content>
        </SheetDemo>
    ),
};

/** All slots composed; a composed Handle implies showHandleOnMinimized. */
export const ComposedSlots: Story = {
    render: (args) => (
        <SheetDemo {...args}>
            <BottomSheet.Handle>
                <Text style={{ paddingBottom: 4 }}>⌃</Text>
            </BottomSheet.Handle>
            <BottomSheet.Minimized>
                <Text style={{ fontWeight: '600' }}>Minimized summary</Text>
            </BottomSheet.Minimized>
            <BottomSheet.Content style={{ gap: 8 }}>
                {Array.from({ length: 10 }, (_, i) => (
                    <Text key={i}>Expandable row {i + 1}</Text>
                ))}
            </BottomSheet.Content>
        </SheetDemo>
    ),
};

/** Render-function children receive the resolved tokens and merged style. */
export const ContentRenderFunction: Story = {
    render: (args) => (
        <SheetDemo {...args}>
            <BottomSheet.Handle />
            <BottomSheet.Content>
                {({ tokens, style }) => (
                    <Animated.View style={style}>
                        <Text style={{ color: String(tokens.handleColor) }}>
                            Styled from the resolved tokens.
                        </Text>
                    </Animated.View>
                )}
            </BottomSheet.Content>
        </SheetDemo>
    ),
};

/** The sheet rises above the keyboard while an input is focused. */
export const KeyboardAvoidance: Story = {
    render: (args) => (
        <SheetDemo {...args}>
            <BottomSheet.Content>
                <TextField header="Name" placeholder="Start typing…" />
            </BottomSheet.Content>
        </SheetDemo>
    ),
};

/**
 * The sheet is a bottom-anchored absolute element that clips its content:
 * lift and inset it with bottom/left/right offsets to float it.
 */
export const Lifted: Story = {
    render: (args) => (
        <SheetDemo
            {...args}
            styleOverrides={{
                sheet: {
                    bottom: 24,
                    left: 16,
                    right: 16,
                    borderRadius: 24,
                },
            }}
        >
            <BottomSheet.Content>
                <Text style={{ fontWeight: '600' }}>Floating sheet</Text>
                <Text>Lifted off the screen edge via the sheet style.</Text>
            </BottomSheet.Content>
        </SheetDemo>
    ),
};

export const StyleOverrides: Story = {
    render: (args) => (
        <SheetDemo
            {...args}
            styleOverrides={{
                sheet: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
                handle: { backgroundColor: 'tomato', width: 80 },
            }}
        >
            <BottomSheet.Content>
                <Text>Square corners and a tomato handle.</Text>
            </BottomSheet.Content>
        </SheetDemo>
    ),
};
