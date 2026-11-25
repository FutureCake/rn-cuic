import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { withRenderContainer } from '../helpers/render-container';
import { Surface, Text } from '../helpers/ui';

const variants = ['title', 'body', 'label', 'caption'] as const;
const weights = ['regular', 'medium', 'semibold', 'bold'] as const;

const meta = {
    title: 'Visuals/Text',
    component: Text,
    decorators: [withRenderContainer],
    args: {
        children: 'The quick brown fox jumps over the lazy dog',
        variant: 'body',
        theme: 'light',
    },
    argTypes: {
        children: { control: 'text' },
        variant: { control: 'select', options: [...variants] },
        weight: { control: 'select', options: [...weights] },
        theme: { control: 'select', options: ['light', 'dark'] },
        color: { control: 'color' },
    },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
    render: (args) => (
        <View style={{ gap: 12 }}>
            {variants.map((variant) => (
                <Text key={variant} {...args} variant={variant}>
                    {variant}: {args.children}
                </Text>
            ))}
        </View>
    ),
};

export const Weights: Story = {
    render: (args) => (
        <View style={{ gap: 12 }}>
            {weights.map((weight) => (
                <Text key={weight} {...args} weight={weight}>
                    {weight}: {args.children}
                </Text>
            ))}
        </View>
    ),
};

/** Nested Text inherits the parent's variant, theme and color. */
export const Nested: Story = {
    render: (args) => (
        <Text {...args}>
            Signed in as <Text weight="bold">Ada Lovelace</Text>, last seen{' '}
            <Text color="#4f46e5">2 minutes ago</Text>.
        </Text>
    ),
};

export const ColorOverride: Story = {
    args: { variant: 'title', color: '#4f46e5' },
};

/** Per-instance theme; the dark surface makes the dark palette readable. */
export const DarkTheme: Story = {
    args: { theme: 'dark' },
    render: (args) => (
        <Surface theme="dark" padding={16}>
            <View style={{ gap: 12 }}>
                {variants.map((variant) => (
                    <Text key={variant} {...args} variant={variant}>
                        {variant}: {args.children}
                    </Text>
                ))}
            </View>
        </Surface>
    ),
};
