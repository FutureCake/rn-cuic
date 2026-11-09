import type { Meta, StoryObj } from '@storybook/react-native';
import {
    Text,
    View,
    type TextProps,
    type TextStyle,
    type ViewProps,
    type ViewStyle,
} from 'react-native';
import {
    buttonStyleDefinition,
    createUI,
    type StyleDefinition,
    type StyleOverrides,
    type UIComponentBuilderOptions,
    type UIComponentDefaults,
} from 'rn-cuic';

// Custom components own their influence names, tokens, states and slots.
type BadgeDefinition = StyleDefinition<
    { tone: 'info' | 'success' },
    { color: string; background: string },
    never,
    { text: TextStyle }
>;
const badgeDefinition: BadgeDefinition = {
    defaultTokens: { color: '#1e40af', background: '#dbeafe' },
    influenceResolvers: {
        toneResolver: {
            info: {},
            success: { color: '#166534', background: '#dcfce7' },
        },
    },
    stateResolvers: {},
    slotStyles: {
        text: ({ color, background }) => ({
            color,
            backgroundColor: background,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
            alignSelf: 'flex-start',
        }),
    },
};

type BadgeProps = TextProps &
    Partial<UIComponentDefaults<BadgeDefinition>> & {
        styleOverrides?: StyleOverrides<'text'>;
    };

function createBadge({
    defaults,
    useStyles,
}: UIComponentBuilderOptions<BadgeDefinition>) {
    return function Badge({
        tone = defaults.tone,
        styleOverrides,
        style,
        ...props
    }: BadgeProps) {
        const { styles } = useStyles({
            influencers: { tone },
            overrides: styleOverrides,
        });
        return <Text {...props} style={[styles.text, style]} />;
    };
}

type CardDefinition = StyleDefinition<
    { layout: 'horizontal' | 'vertical'; density: 'compact' | 'comfortable' },
    {
        direction: ViewStyle['flexDirection'];
        padding: number;
        background: string;
    },
    'highlighted',
    { container: ViewStyle }
>;
const cardDefinition: CardDefinition = {
    defaultTokens: { direction: 'column', padding: 16, background: '#f1f5f9' },
    influenceResolvers: {
        layoutResolver: {
            horizontal: { direction: 'row' },
            vertical: {},
        },
        densityResolver: {
            compact: ({ layout }) => ({
                padding: layout === 'horizontal' ? 8 : 10,
            }),
            comfortable: { padding: 20 },
        },
    },
    stateResolvers: { highlighted: { background: '#fef3c7' } },
    slotStyles: {
        container: ({ direction, padding, background }) => ({
            flexDirection: direction,
            padding,
            gap: 12,
            borderRadius: 12,
            backgroundColor: background,
        }),
    },
};

type CardProps = ViewProps &
    Partial<UIComponentDefaults<CardDefinition>> & {
        highlighted?: boolean;
    };

function createCard({
    defaults,
    useStyles,
}: UIComponentBuilderOptions<CardDefinition>) {
    function Card({
        layout = defaults.layout,
        density = defaults.density,
        highlighted = false,
        style,
        ...props
    }: CardProps) {
        const { styles } = useStyles({
            influencers: { layout, density },
            states: { highlighted },
        });
        return <View {...props} style={[styles.container, style]} />;
    }
    // Builders can return compound components without losing their static members.
    return Object.assign(Card, { Title: Text });
}

const ui = createUI(
    {
        Button: {
            definition: buttonStyleDefinition,
            defaults: { variant: 'primary', size: 'small', theme: 'light' },
        },
        Badge: { definition: badgeDefinition, defaults: { tone: 'info' } },
        Card: {
            definition: cardDefinition,
            defaults: { layout: 'vertical', density: 'comfortable' },
        },
    },
    { components: { Badge: createBadge, Card: createCard } }
);

// Button is optional: this family contains only the consumer-defined Badge.
const standalone = createUI(
    { Badge: { definition: badgeDefinition, defaults: { tone: 'success' } } },
    { components: { Badge: createBadge } }
);

const meta = {
    title: 'Custom components/Shared collection',
    component: ui.Card,
    decorators: [
        (Story) => (
            <ui.StylesProvider>
                <View style={{ padding: 16, gap: 16 }}>
                    <Story />
                </View>
            </ui.StylesProvider>
        ),
    ],
    argTypes: {
        layout: { control: 'select', options: ['horizontal', 'vertical'] },
        density: { control: 'select', options: ['compact', 'comfortable'] },
        highlighted: { control: 'boolean' },
    },
} satisfies Meta<typeof ui.Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SharedProvider: Story = {
    render: (args) => (
        <ui.Card {...args}>
            <ui.Card.Title>Built-in and custom components</ui.Card.Title>
            <ui.Badge tone="success">Ready</ui.Badge>
            <ui.Button text="Continue" />
        </ui.Card>
    ),
};

export const IndependentCustomOnlyFamily: Story = {
    render: (args) => (
        <ui.Card {...args}>
            <ui.Badge>Outer family: info by default</ui.Badge>
            <standalone.StylesProvider>
                <standalone.Badge>
                    Independent family: success by default
                </standalone.Badge>
                <ui.Badge>Still uses the outer family's defaults</ui.Badge>
            </standalone.StylesProvider>
        </ui.Card>
    ),
};
