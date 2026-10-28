import type { Meta, StoryObj } from '@storybook/react-native';
import {
    ActivityIndicator,
    StyleSheet,
    type ImageSourcePropType,
} from 'react-native';
import { Button, type ButtonProps } from 'rn-cuic';
import { withRenderContainer } from '../helpers/render-container';

const icon: ImageSourcePropType = require('../../example/assets/android-icon-monochrome.png');

const styles = StyleSheet.create({
    container: { gap: 8 },
    text: { fontWeight: '700' },
    icon: { width: 24, height: 24 },
});

// Select root controls without forwarding inherited shorthand content to children.
function composedProps({
    variant,
    size,
    theme,
    disabled,
    onPress,
    onPressIn,
    onPressOut,
}: ButtonProps) {
    return { variant, size, theme, disabled, onPress, onPressIn, onPressOut };
}

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

export const IconShorthand: Story = {
    args: { text: 'Save', icon },
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
        <Button {...composedProps(args)}>
            <Button.Icon source={icon} />
            <Button.Text>{args.text}</Button.Text>
        </Button>
    ),
};

export const TrailingIcon: Story = {
    render: (args) => (
        <Button {...composedProps(args)}>
            <Button.Text>{args.text}</Button.Text>
            <Button.Icon source={icon} />
        </Button>
    ),
};

export const IconOnly: Story = {
    render: (args) => (
        <Button {...composedProps(args)} accessibilityLabel="Save">
            <Button.Icon source={icon} />
        </Button>
    ),
};

export const CustomIconContent: Story = {
    render: (args) => (
        <Button {...composedProps(args)}>
            <Button.Icon>
                <ActivityIndicator accessibilityLabel="Loading" />
            </Button.Icon>
            <Button.Text>{args.text}</Button.Text>
        </Button>
    ),
};

export const TokenAwareIcon: Story = {
    render: (args) => (
        <Button {...composedProps(args)}>
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
        <Button
            {...composedProps(args)}
            styleOverrides={{ container: styles.container }}
        >
            <Button.Icon source={icon} style={styles.icon} />
            <Button.Text style={styles.text}>{args.text}</Button.Text>
        </Button>
    ),
};
