import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { Box } from 'rn-cuic';
import { withRenderContainer } from '../helpers/render-container';

function Content({ label }: { label: string }) {
    return (
        <View
            style={{
                height: 40,
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
    title: 'Layouts/Box',
    component: Box,
    decorators: [withRenderContainer],
    args: {
        padding: 16,
    },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PaddingNumber: Story = {
    render: (args) => (
        <Box {...args} style={{ backgroundColor: '#eef2ff' }}>
            <Content label="padding={16}" />
        </Box>
    ),
};

export const PaddingXY: Story = {
    args: { padding: { x: 32, y: 8 } },
    render: (args) => (
        <Box {...args} style={{ backgroundColor: '#eef2ff' }}>
            <Content label="padding={{ x: 32, y: 8 }}" />
        </Box>
    ),
};

export const PaddingSides: Story = {
    args: { padding: { top: 4, right: 8, bottom: 24, left: 40 } },
    render: (args) => (
        <Box {...args} style={{ backgroundColor: '#eef2ff' }}>
            <Content label="top/right/bottom/left" />
        </Box>
    ),
};

export const PaddingAxisAndSide: Story = {
    args: { padding: { x: 32, top: 24 } },
    render: (args) => (
        <Box {...args} style={{ backgroundColor: '#eef2ff' }}>
            <Content label="padding={{ x: 32, top: 24 }}" />
        </Box>
    ),
};
