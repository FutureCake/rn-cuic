import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { VStack } from 'rn-cuic';
import { withRenderContainer } from '../helpers/render-container';

function Box({ label, height = 40 }: { label: string; height?: number }) {
    return (
        <View
            style={{
                height,
                minWidth: 80,
                borderRadius: 8,
                backgroundColor: '#c7d2fe',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 12,
            }}
        >
            <Text>{label}</Text>
        </View>
    );
}

const meta = {
    title: 'Layouts/VStack',
    component: VStack,
    decorators: [withRenderContainer],
    args: {
        spacing: 12,
    },
    argTypes: {
        align: {
            control: 'select',
            options: ['flex-start', 'center', 'flex-end', 'stretch'],
        },
        justify: {
            control: 'select',
            options: [
                'flex-start',
                'center',
                'flex-end',
                'space-between',
                'space-around',
            ],
        },
    },
} satisfies Meta<typeof VStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <VStack {...args}>
            <Box label="One" />
            <Box label="Two" />
            <Box label="Three" />
        </VStack>
    ),
};

export const PaddingNumber: Story = {
    args: { padding: 24 },
    render: (args) => (
        <VStack {...args} style={{ backgroundColor: '#eef2ff' }}>
            <Box label="Padded" />
            <Box label="padding={24}" />
        </VStack>
    ),
};

export const PaddingXY: Story = {
    args: { padding: { x: 32, y: 8 } },
    render: (args) => (
        <VStack {...args} style={{ backgroundColor: '#eef2ff' }}>
            <Box label="Padded x/y" />
            <Box label="padding={{ x: 32, y: 8 }}" />
        </VStack>
    ),
};

export const Aligned: Story = {
    args: { align: 'center', justify: 'space-between' },
    render: (args) => (
        <VStack {...args}>
            <Box label="Left" />
            <Box label="Middle" height={64} />
            <Box label="Right" />
        </VStack>
    ),
};
