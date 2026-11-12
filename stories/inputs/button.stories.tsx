import type { Meta, StoryObj } from '@storybook/react-native';
import { ActivityIndicator, type ImageSourcePropType } from 'react-native';
import { withRenderContainer } from '../helpers/render-container';
import { Button, useTheme } from '../helpers/ui';

const icon: ImageSourcePropType = require('../../example/assets/android-icon-monochrome.png');

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
            options: ['primary', 'secondary'],
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
    args: {
        text: 'Unavailable',
        disabled: true,
    },
};

export const IconShorthand: Story = {
    args: {
        text: 'Save',
        icon,
    },
};

export const IconOverride: Story = {
    args: { text: 'Save', icon },
    render: (args) => (
        <Button {...args}>
            <Button.Icon>
                {({ tokens }) => (
                    <ActivityIndicator
                        color={tokens.iconColor}
                        size={tokens.iconSize}
                    />
                )}
            </Button.Icon>
        </Button>
    ),
};

export const TextOverride: Story = {
    args: { text: 'Replaced label', icon },
    render: (args) => (
        <Button {...args}>
            <Button.Text>Custom label</Button.Text>
        </Button>
    ),
};

export const BothOverridesInChildOrder: Story = {
    args: { text: 'Replaced label', icon },
    render: (args) => (
        <Button {...args}>
            <>
                <Button.Text>Custom label before icon</Button.Text>
                <Button.Icon source={icon} />
            </>
        </Button>
    ),
};

export const LeadingIcon: Story = {
    render: (args) => (
        <Button {...args}>
            <Button.Icon source={icon} />
            <Button.Text>{args.text}</Button.Text>
        </Button>
    ),
};

export const TrailingIcon: Story = {
    render: (args) => (
        <Button {...args}>
            <Button.Text>{args.text}</Button.Text>
            <Button.Icon source={icon} />
        </Button>
    ),
};

export const IconOnly: Story = {
    render: (args) => (
        <Button {...args} accessibilityLabel="Save">
            <Button.Icon source={icon} />
        </Button>
    ),
};

export const CustomIconContent: Story = {
    render: (args) => (
        <Button {...args}>
            <Button.Icon>
                <ActivityIndicator accessibilityLabel="Loading" />
            </Button.Icon>
            <Button.Text>{args.text}</Button.Text>
        </Button>
    ),
};

export const TokenAwareIcon: Story = {
    render: (args) => (
        <Button {...args}>
            <Button.Icon>
                {({ tokens }) => (
                    <ActivityIndicator
                        color={tokens.iconColor}
                        size={tokens.iconSize}
                        accessibilityLabel="Loading"
                    />
                )}
            </Button.Icon>
            <Button.Text>{args.text}</Button.Text>
        </Button>
    ),
};

export const SlotOverrides: Story = {
    render: (args) => (
        <Button {...args} styleOverrides={{ container: { gap: 8 } }}>
            <Button.Icon source={icon} style={{ width: 24, height: 24 }} />
            <Button.Text style={{ fontWeight: '700' }}>{args.text}</Button.Text>
        </Button>
    ),
};

/** The ambient theme from StylesProvider; instances without a theme prop follow it. */
function ThemeToggleDemo() {
    const { theme, setTheme } = useTheme();
    return (
        <Button
            text={`Theme: ${theme} (press to toggle)`}
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />
    );
}

export const AmbientThemeToggle: Story = {
    render: () => <ThemeToggleDemo />,
};
