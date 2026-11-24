import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { ZStack } from 'rn-cuic';
import { withRenderContainer } from '../helpers/render-container';

function Card({ label, color }: { label: string; color: string }) {
    return (
        <View
            style={{
                width: 120,
                height: 72,
                borderRadius: 12,
                backgroundColor: color,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text>{label}</Text>
        </View>
    );
}

const meta = {
    title: 'Layouts/ZStack',
    component: ZStack,
    decorators: [withRenderContainer],
    args: {
        offset: { x: 12, y: 12 },
    },
    argTypes: {
        align: {
            control: 'select',
            options: ['flex-start', 'center', 'flex-end', 'stretch'],
        },
    },
} satisfies Meta<typeof ZStack>;

export default meta;
type Story = StoryObj<typeof meta>;

// An array (not a Fragment) so ZStack receives each card as its own layer.
const cards = [
    <Card key="bottom" label="Bottom" color="#e0e7ff" />,
    <Card key="middle" label="Middle" color="#c7d2fe" />,
    <Card key="top" label="Top" color="#a5b4fc" />,
];

export const Staggered: Story = {
    render: (args) => <ZStack {...args}>{cards}</ZStack>,
};

export const Overlay: Story = {
    args: { offset: 0 },
    render: (args) => <ZStack {...args}>{cards}</ZStack>,
};

export const NegativeOffset: Story = {
    args: { offset: { x: -16, y: 8 }, align: 'center' },
    render: (args) => <ZStack {...args}>{cards}</ZStack>,
};

export const Padded: Story = {
    args: { padding: 24, align: 'center' },
    render: (args) => (
        <ZStack {...args} style={{ backgroundColor: '#eef2ff' }}>
            {cards}
        </ZStack>
    ),
};
