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
const toppingOptions = toppings.map((topping) => ({
    title: topping,
    value: topping,
}));

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
        />
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
        />
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
        options: toppingOptions,
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
        />
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
            options={items.map((topping) => ({
                title: topping,
                value: topping,
            }))}
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
        />
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
        <Chips
            {...rest}
            selectionMode="none"
            header="Read-only tags"
            options={toppings.slice(0, 3).map((topping) => ({
                title: topping,
                value: topping,
            }))}
        />
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
    options: _options,
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
            {toppings.slice(0, 4).map((topping) => (
                <Chip key={topping} value={topping} text={topping} />
            ))}
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
