import type { Decorator, Meta, StoryObj } from '@storybook/react-native';
import { Button, StylesProvider } from 'rn-cuic';

const withStylesProvider: Decorator = (Story) => (
  <StylesProvider>
    <Story />
  </StylesProvider>
);

const meta = {
  title: 'Inputs/Button',
  component: Button,
  decorators: [withStylesProvider],
  args: {
    text: 'Press and hold',
    variant: 'rounded',
    size: 'medium',
    theme: 'light',
    disabled: false,
  },
  argTypes: {
    text: { control: 'text' },
    variant: { control: 'select', options: ['rounded', 'square'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
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
