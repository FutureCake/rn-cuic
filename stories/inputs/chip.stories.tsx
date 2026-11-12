import type { Meta, StoryObj } from '@storybook/react-native';
import { useState, type ComponentProps } from 'react';
import { ActivityIndicator, type ImageSourcePropType } from 'react-native';
import Animated from 'react-native-reanimated';
import { withRenderContainer } from '../helpers/render-container';
import { Chip } from '../helpers/ui';

const icon: ImageSourcePropType = require('../../example/assets/android-icon-monochrome.png');

type ChipArgs = ComponentProps<typeof Chip>;

function ControlledChip(props: ChipArgs) {
    const [selected, setSelected] = useState(props.selected ?? false);
    return (
        <Chip
            {...props}
            selected={selected}
            onChange={(next) => {
                setSelected(next);
                props.onChange?.(next);
            }}
        />
    );
}

const meta = {
    title: 'Inputs/Chip',
    component: Chip,
    decorators: [withRenderContainer],
    args: {
        text: 'Filter',
        size: 'm',
        theme: 'light',
        disabled: false,
        selected: false,
        showIcon: 'selected',
    },
    argTypes: {
        text: { control: 'text' },
        size: { control: 'select', options: ['s', 'm', 'l'] },
        theme: { control: 'select', options: ['light', 'dark'] },
        disabled: { control: 'boolean' },
        selected: { control: 'boolean' },
        showIcon: { control: 'select', options: ['selected', 'always'] },
        onChange: { action: 'changed' },
        onClose: { action: 'closed' },
    },
    render: (args) => <ControlledChip {...args} />,
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
    args: { selected: true },
};

export const Disabled: Story = {
    args: { text: 'Unavailable', disabled: true },
};

export const DisplayOnly: Story = {
    args: { text: 'Read-only tag', icon, showIcon: 'always' },
    render: (args) => (
        <Chip {...args} onChange={undefined} onPress={undefined} />
    ),
};

export const DisplayOnlyRemovable: Story = {
    args: { text: 'Static but removable' },
    render: (args) => (
        <Chip
            {...args}
            onChange={undefined}
            onPress={undefined}
            onClose={() => args.onClose?.()}
        />
    ),
};

export const IconWhenSelected: Story = {
    args: { text: 'Shows icon on select', icon },
};

export const IconAlways: Story = {
    args: { text: 'Always shows icon', icon, showIcon: 'always' },
};

export const Closable: Story = {
    args: { text: 'Removable' },
    render: (args) => (
        <ControlledChip {...args} onClose={() => args.onClose?.()} />
    ),
};

export const CustomCloseIcon: Story = {
    args: { text: 'Custom close', icon },
    render: (args) => (
        <ControlledChip
            {...args}
            closeIcon={icon}
            onClose={() => args.onClose?.()}
        />
    ),
};

export const CloseRenderFunction: Story = {
    args: { text: 'Busy close' },
    render: (args) => (
        <ControlledChip {...args} onClose={() => args.onClose?.()}>
            <Chip.Text>{args.text}</Chip.Text>
            <Chip.Close>
                {({ tokens }) => (
                    <ActivityIndicator
                        color={tokens.closeColor}
                        size={tokens.closeSize}
                    />
                )}
            </Chip.Close>
        </ControlledChip>
    ),
};

export const TextRenderFunction: Story = {
    render: (args) => (
        <ControlledChip {...args}>
            <Chip.Text>
                {({ selected, style }) => (
                    <Animated.Text style={style}>
                        {selected ? 'Selected' : 'Not selected'}
                    </Animated.Text>
                )}
            </Chip.Text>
        </ControlledChip>
    ),
};

export const IconRenderFunction: Story = {
    args: { text: 'Loading' },
    render: (args) => (
        <ControlledChip {...args}>
            <Chip.Icon>
                {({ tokens }) => (
                    <ActivityIndicator
                        color={tokens.iconColor}
                        size={tokens.iconSize}
                    />
                )}
            </Chip.Icon>
        </ControlledChip>
    ),
};

export const ComposedSlots: Story = {
    render: (args) => (
        <ControlledChip {...args} onClose={() => args.onClose?.()}>
            <Chip.Icon source={icon} />
            <Chip.Text>Composed</Chip.Text>
            <Chip.Close />
        </ControlledChip>
    ),
};
