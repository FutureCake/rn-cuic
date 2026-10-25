import type { Meta, StoryObj } from '@storybook/react-native';
import { Button } from 'rn-cuic';
import { withRenderContainer } from '../helpers/render-container';

const meta = {
    title: 'Inputs/Button',
    component: Button,
    decorators: [withRenderContainer],
    args: {
        text: 'Press and hold',
        variant: 'primary',
        size: 'small',
        theme: 'light',
        disabled: false,
    },
    argTypes: {
        text: { control: 'text' },
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'left-to-right'],
        },
        size: { control: 'select', options: ['small', 'large', 'xlarge'] },
        theme: { control: 'select', options: ['light', 'dark'] },
        disabled: { control: 'boolean' },
        onPress: { action: 'pressed' },
        onPressIn: { action: 'press in' },
        onPressOut: { action: 'press out' },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
    args: { text: 'Unavailable', disabled: true },
};
