import type { Meta, StoryObj } from '@storybook/react-native';
import { useState, type ComponentProps } from 'react';
import Animated from 'react-native-reanimated';
import { withRenderContainer } from '../helpers/render-container';
import { Chip, Chips } from '../helpers/ui';

const toppings = [
    'Cheese',
    'Mushrooms',
    'Pepperoni',
    'Olives',
    'Onions',
    'Peppers',
    'Pineapple',
];

/** The group controls Chip children; identity is each chip's `value`. */
function toppingChips(items: readonly string[]) {
    return items.map((topping) => (
        <Chip key={topping} value={topping} text={topping} />
    ));
}

type ChipsArgs = ComponentProps<typeof Chips>;

function SingleSelectChips({ value: _value, onChange, ...rest }: ChipsArgs) {
    const [value, setValue] = useState<unknown>(null);
    return (
        <Chips
            {...rest}
            value={value}
            onChange={(next) => {
                setValue(next);
                onChange?.(next);
            }}
        >
            {toppingChips(toppings)}
        </Chips>
    );
}

function MultiSelectChips({
    selectionMode: _mode,
    value: _value,
    onChange,
    ...rest
}: ChipsArgs) {
    const [value, setValue] = useState<unknown[]>([]);
    return (
        <Chips
            {...rest}
            selectionMode="multi"
            value={value}
            onChange={(next) => {
                setValue(next);
                onChange?.(next);
            }}
        >
            {toppingChips(toppings)}
        </Chips>
    );
}

const meta = {
    title: 'Inputs/Chips',
    component: Chips,
    decorators: [withRenderContainer],
    args: {
        layout: 'wrap',
        theme: 'light',
        disabled: false,
    },
    argTypes: {
        layout: { control: 'select', options: ['wrap', 'scroll'] },
        theme: { control: 'select', options: ['light', 'dark'] },
        disabled: { control: 'boolean' },
        size: { control: 'select', options: ['s', 'm', 'l'] },
        header: { control: 'text' },
        onChange: { action: 'changed' },
        onClose: { action: 'closed' },
    },
    render: (args) => <SingleSelectChips {...args} />,
} satisfies Meta<typeof Chips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {};

export const MultiSelect: Story = {
    render: (args) => <MultiSelectChips {...args} />,
};

export const ScrollLayout: Story = {
    args: { layout: 'scroll' },
    render: (args) => <MultiSelectChips {...args} />,
};

export const HeaderAndFeedback: Story = {
    args: {
        header: 'Toppings',
        feedback: 'Pick as many as you like.',
    },
    render: (args) => <MultiSelectChips {...args} />,
};

export const Validation: Story = {
    args: { header: 'Toppings (max 2)' },
    render: (args) => <ValidatedChips {...args} />,
};

function ValidatedChips({
    selectionMode: _mode,
    value: _value,
    onChange: _onChange,
    validation: _validation,
    ...rest
}: ChipsArgs) {
    const [value, setValue] = useState<unknown[]>([]);
    return (
        <Chips
            {...rest}
            selectionMode="multi"
            value={value}
            onChange={(next) => setValue(next)}
            feedback="Pick up to two toppings."
            validation={{
                validator: (next) =>
                    next.length <= 2
                        ? { valid: true }
                        : {
                              valid: false,
                              variant: 'error',
                              message: 'No more than two toppings.',
                          },
            }}
        >
            {toppingChips(toppings)}
        </Chips>
    );
}

export const GroupClose: Story = {
    render: (args) => <RemovableChips {...args} />,
};

function RemovableChips({
    selectionMode: _mode,
    value: _value,
    onChange: _onChange,
    validation: _validation,
    onClose,
    ...rest
}: ChipsArgs) {
    const [items, setItems] = useState(toppings.slice(0, 5));
    const [value, setValue] = useState<unknown[]>([]);
    return (
        <Chips
            {...rest}
            selectionMode="multi"
            value={value}
            onChange={(next) => setValue(next)}
            onClose={(removed) => {
                setItems((current) =>
                    current.filter((item) => item !== removed)
                );
                setValue((current) =>
                    current.filter((item) => item !== removed)
                );
                onClose?.(removed);
            }}
        >
            {toppingChips(items)}
        </Chips>
    );
}

export const GroupSize: Story = {
    args: { size: 's', header: 'Small chips' },
    render: (args) => <MultiSelectChips {...args} />,
};

export const Disabled: Story = {
    args: { disabled: true, header: 'Unavailable' },
};

export const DisplayOnly: Story = {
    render: (args) => <DisplayOnlyChips {...args} />,
};

function DisplayOnlyChips({
    selectionMode: _mode,
    value: _value,
    onChange: _onChange,
    validation: _validation,
    ...rest
}: ChipsArgs) {
    return (
        <Chips {...rest} selectionMode="none" header="Read-only tags">
            {toppingChips(toppings.slice(0, 3))}
        </Chips>
    );
}

export const ComposedSlots: Story = {
    render: (args) => <ComposedChips {...args} />,
};

/** Composition path: Chip children (the group controls them) plus slots. */
function ComposedChips({
    selectionMode: _mode,
    value: _value,
    onChange: _onChange,
    validation: _validation,
    ...rest
}: ChipsArgs) {
    const [value, setValue] = useState<unknown>(null);
    return (
        <Chips
            {...rest}
            value={value}
            onChange={(next) => setValue(next)}
            feedback="One topping only."
        >
            <Chips.Header>
                {({ tokens, style }) => (
                    <Animated.Text
                        style={[style, { fontSize: tokens.headerFontSize }]}
                    >
                        Favorite topping{value != null ? `: ${value}` : ''}
                    </Animated.Text>
                )}
            </Chips.Header>
            {toppingChips(toppings.slice(0, 4))}
            <Chips.Feedback>
                {({ message, style }) =>
                    message !== undefined ? (
                        <Animated.Text style={style}>{message}</Animated.Text>
                    ) : null
                }
            </Chips.Feedback>
        </Chips>
    );
}
