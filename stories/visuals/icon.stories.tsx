import type { Meta, StoryObj } from '@storybook/react-native';
import { View, type ImageSourcePropType } from 'react-native';
import { withRenderContainer } from '../helpers/render-container';
import { Icon } from '../helpers/ui';

const source: ImageSourcePropType = require('../../example/assets/android-icon-monochrome.png');

const meta = {
    title: 'Visuals/Icon',
    component: Icon,
    decorators: [withRenderContainer],
    args: {
        source,
        size: 'm',
        theme: 'light',
    },
    argTypes: {
        size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
        theme: { control: 'select', options: ['light', 'dark'] },
    },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
    render: (args) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
                <Icon key={size} {...args} size={size} />
            ))}
        </View>
    ),
};

export const TintOverride: Story = {
    args: {
        size: 'xl',
        styleOverrides: { icon: { tintColor: '#4f46e5' } },
    },
};
