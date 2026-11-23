import type { Meta, StoryObj } from '@storybook/react-native';
import { useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { ModalProps } from 'rn-cuic';
import { withRenderContainer } from '../helpers/render-container';
import { Button, Modal } from '../helpers/ui';

const meta = {
    title: 'Overlays/Modal',
    component: Modal,
    decorators: [withRenderContainer],
    args: {
        backdrop: true,
        closeOnPressOutside: true,
        theme: 'light',
        onClose: () => {},
    },
    argTypes: {
        backdrop: { control: 'boolean' },
        closeOnPressOutside: { control: 'boolean' },
        minWidth: { control: 'number' },
        maxWidth: { control: 'number' },
        minHorizontalSpacing: { control: 'number' },
        theme: { control: 'select', options: ['light', 'dark'] },
        onClose: { action: 'closed' },
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Mount-controlled wrapper: a button mounts the modal, onClose unmounts it
 * after the exit animation.
 */
function ModalDemo({
    children,
    ...props
}: Partial<ModalProps> & { children?: ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <View style={{ flex: 1 }}>
            <Button text="Open modal" onPress={() => setOpen(true)} />
            {open && (
                <Modal
                    {...props}
                    onClose={() => {
                        setOpen(false);
                        props.onClose?.();
                    }}
                >
                    {children}
                </Modal>
            )}
        </View>
    );
}

/** Arbitrary JSX children render straight into the centered card. */
export const Default: Story = {
    render: (args) => (
        <ModalDemo {...args}>
            <Text style={{ fontSize: 17, fontWeight: '600' }}>
                Hello from the modal
            </Text>
            <Text>
                It fades and slides in from below; press outside the card to
                dismiss it.
            </Text>
        </ModalDemo>
    ),
};

/** No scrim, but pressing outside still closes via closeOnPressOutside. */
export const WithoutBackdrop: Story = {
    args: { backdrop: false },
    render: (args) => (
        <ModalDemo {...args}>
            <Text>No scrim renders behind this card.</Text>
        </ModalDemo>
    ),
};

/**
 * With closeOnPressOutside off the modal only closes through its own
 * content — unmounting plays the exit animation automatically.
 */
export const ExplicitClose: Story = {
    args: { closeOnPressOutside: false },
    render: (args) => {
        function Demo() {
            const [open, setOpen] = useState(false);
            return (
                <View style={{ flex: 1 }}>
                    <Button text="Open modal" onPress={() => setOpen(true)} />
                    {open && (
                        <Modal {...args} onClose={() => setOpen(false)}>
                            <Text>
                                Pressing outside does nothing; use the button.
                            </Text>
                            <Button
                                text="Close"
                                onPress={() => setOpen(false)}
                            />
                        </Modal>
                    )}
                </View>
            );
        }
        return <Demo />;
    },
};

/**
 * The card hugs its content; the sizing props clamp it per instance —
 * minWidth stops it collapsing around short content, maxWidth caps it and
 * minHorizontalSpacing keeps the edge gap.
 */
export const Sizing: Story = {
    args: { minWidth: 280, maxWidth: 320, minHorizontalSpacing: 32 },
    render: (args) => (
        <ModalDemo {...args}>
            <Text>Short.</Text>
        </ModalDemo>
    ),
};

/** Slot-aware overrides restyle the backdrop and card. */
export const StyleOverrides: Story = {
    render: (args) => (
        <ModalDemo
            {...args}
            styleOverrides={{
                backdrop: { backgroundColor: '#1e1b4b' },
                card: {
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: '#4f46e5',
                },
            }}
        >
            <Text>A square-ish indigo take on the same card.</Text>
        </ModalDemo>
    ),
};
