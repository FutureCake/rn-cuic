import type { Meta, StoryObj } from '@storybook/react-native';
import { ActivityIndicator, Text, View } from 'react-native';
import { buttonStyleDefinition, createUI, defineButtonStyles } from 'rn-cuic';

const customDefinition = defineButtonStyles({
    defaultTokens: {
        ...buttonStyleDefinition.defaultTokens,
        fontSize: 16,
        paddingX: 16,
        paddingY: 8,
        iconGap: 8,
        iconSize: 18,
        radius: 12,
        bgColor: '#4f46e5',
        textColor: '#ffffff',
        iconColor: '#ffffff',
    },
    influenceOrder: ['theme', 'variant', 'size'],
    stateOrder: ['pressed', 'disabled'],
    influenceResolvers: {
        variantResolver: {
            solid: {},
            outline: ({ theme }) => ({
                bgColor: 'transparent',
                textColor: theme === 'day' ? '#4338ca' : '#c7d2fe',
                iconColor: theme === 'day' ? '#4338ca' : '#c7d2fe',
            }),
        },
        sizeResolver: {
            compact: ({ variant, theme }) => ({
                fontSize: 14,
                paddingX: variant === 'outline' ? 12 : 16,
                paddingY: theme === 'night' ? 9 : 8,
                iconSize: 16,
            }),
            roomy: { fontSize: 18, paddingX: 24, paddingY: 14, iconSize: 22 },
        },
        themeResolver: {
            day: {},
            night: {
                bgColor: '#c7d2fe',
                textColor: '#111827',
                iconColor: '#111827',
            },
        },
    },
    stateResolvers: {
        pressed: ({ variant, size, theme }) => ({
            bgColor:
                variant === 'outline'
                    ? 'transparent'
                    : theme === 'day'
                      ? '#3730a3'
                      : '#a5b4fc',
            radius: size === 'roomy' ? 16 : 10,
        }),
        disabled: ({ variant, theme }) => ({
            bgColor:
                variant === 'outline'
                    ? 'transparent'
                    : theme === 'day'
                      ? '#e5e7eb'
                      : '#374151',
            textColor: '#9ca3af',
            iconColor: '#9ca3af',
        }),
    },
    slotStyles: {
        ...buttonStyleDefinition.slotStyles,
        container: (tokens) => ({
            ...buttonStyleDefinition.slotStyles.container(tokens),
            borderWidth: 1,
            borderColor:
                tokens.bgColor === 'transparent'
                    ? tokens.textColor
                    : 'transparent',
        }),
    },
    transition: buttonStyleDefinition.transition,
});

// Create stable, isolated component/provider/part families at module scope.
const { Button: CustomButton, StylesProvider: CustomStylesProvider } = createUI(
    {
        Button: {
            definition: customDefinition,
            defaults: { variant: 'solid', size: 'compact', theme: 'day' },
        },
    }
);

const { Button: PresetButton, StylesProvider: PresetStylesProvider } = createUI(
    {
        Button: {
            definition: buttonStyleDefinition,
            defaults: { variant: 'primary', size: 'small', theme: 'light' },
        },
    }
);

const meta = {
    title: 'Inputs/Button/Custom families',
    component: CustomButton,
    decorators: [
        (Story) => (
            <CustomStylesProvider>
                <View style={{ flex: 1, padding: 16, gap: 16 }}>
                    <Story />
                </View>
            </CustomStylesProvider>
        ),
    ],
    // No influence args here: Defaults must exercise createUI's real defaults.
    args: { text: 'Press and hold', disabled: false },
    argTypes: {
        text: { control: 'text' },
        variant: { control: 'select', options: ['solid', 'outline'] },
        size: { control: 'select', options: ['compact', 'roomy'] },
        theme: { control: 'select', options: ['day', 'night'] },
        disabled: { control: 'boolean' },
        onPress: { action: 'pressed' },
        onPressIn: { action: 'press in' },
        onPressOut: { action: 'press out' },
    },
} satisfies Meta<typeof CustomButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaults: Story = {};

export const OutlineAtNight: Story = {
    args: { variant: 'outline', size: 'roomy', theme: 'night' },
    render: (args) => (
        <View style={{ padding: 16, backgroundColor: '#111827' }}>
            <CustomButton {...args} />
        </View>
    ),
};

export const Disabled: Story = {
    args: { text: 'Unavailable', disabled: true },
};

export const CompoundWithRenderProp: Story = {
    args: { text: 'Continue', variant: 'outline', size: 'roomy', theme: 'day' },
    render: (args) => (
        <CustomButton {...args}>
            <CustomButton.Icon>
                {({ tokens, pressed, disabled }) => (
                    <ActivityIndicator
                        color={tokens.iconColor}
                        size={tokens.iconSize}
                        animating={!disabled}
                        accessibilityLabel={pressed ? 'Pressed' : 'Loading'}
                    />
                )}
            </CustomButton.Icon>
            <CustomButton.Text>{args.text}</CustomButton.Text>
        </CustomButton>
    ),
};

export const IndependentFamilies: Story = {
    render: (args) => (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
            <View style={{ gap: 12 }}>
                <Text>Custom: solid / compact / day defaults</Text>
                <CustomButton {...args} />
            </View>
            <PresetStylesProvider>
                <View style={{ gap: 12 }}>
                    <Text>Independent preset: primary / small / light</Text>
                    <PresetButton text="Preset defaults" />
                    <PresetButton
                        variant="secondary"
                        size="large"
                        theme="light"
                    >
                        <PresetButton.Text>Preset parts</PresetButton.Text>
                    </PresetButton>
                    <CustomButton text="Still uses the outer custom provider" />
                </View>
            </PresetStylesProvider>
        </View>
    ),
};
