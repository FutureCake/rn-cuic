import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { withRenderContainer } from '../helpers/render-container';
import { Surface } from '../helpers/ui';

const variants = ['framed', 'contained', 'neutral'] as const;
const elevations = ['ground', 'first', 'second', 'third'] as const;

const meta = {
    title: 'Visuals/Surface',
    component: Surface,
    decorators: [withRenderContainer],
    args: {
        variant: 'neutral',
        elevation: 'first',
        theme: 'light',
        padding: 16,
        children: <Text>Surface content</Text>,
    },
    argTypes: {
        variant: { control: 'select', options: [...variants] },
        elevation: { control: 'select', options: [...elevations] },
        theme: { control: 'select', options: ['light', 'dark'] },
        color: { control: 'color' },
        radius: { control: 'number' },
    },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
    render: (args) => (
        <View style={{ gap: 16 }}>
            {variants.map((variant) => (
                <Surface key={variant} {...args} variant={variant}>
                    <Text>{variant}</Text>
                </Surface>
            ))}
        </View>
    ),
};

export const Elevations: Story = {
    render: (args) => (
        <View style={{ gap: 24 }}>
            {elevations.map((elevation) => (
                <Surface key={elevation} {...args} elevation={elevation}>
                    <Text>{elevation}</Text>
                </Surface>
            ))}
        </View>
    ),
};

export const Overrides: Story = {
    args: {
        variant: 'contained',
        color: '#e0e7ff',
        radius: 24,
        padding: { x: 32, y: 12 },
        children: <Text>color + radius + padding overrides</Text>,
    },
};
