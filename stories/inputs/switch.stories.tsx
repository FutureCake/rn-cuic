import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import Animated from 'react-native-reanimated';
import { Switch, type SwitchProps } from 'rn-cuic';
import { withRenderContainer } from '../helpers/render-container';

const options = [
    { title: 'Daily', value: 'daily' },
    { title: 'Weekly', value: 'weekly' },
    { title: 'Monthly', value: 'monthly' },
];

const meta = {
    title: 'Inputs/Switch',
    component: Switch,
    decorators: [withRenderContainer],
    args: {
        options,
        value: 'daily',
        theme: 'light',
        disabled: false,
    },
    argTypes: {
        theme: { control: 'select', options: ['light', 'dark'] },
        disabled: { control: 'boolean' },
        onChange: { action: 'changed' },
    },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled wrapper so the switch responds to presses in the story. */
function ControlledSwitch(props: Omit<SwitchProps<unknown>, 'value'>) {
    const [value, setValue] = useState<unknown>('daily');
    return (
        <Switch
            {...props}
            value={value}
            onChange={(next) => {
                setValue(next);
                props.onChange?.(next);
            }}
        />
    );
}

export const Default: Story = {
    render: (args) => <ControlledSwitch {...args} />,
};

export const Disabled: Story = {
    args: { value: 'weekly', disabled: true },
};

export const OptionSlots: Story = {
    args: { options: undefined },
    render: (args) => (
        <ControlledSwitch {...args}>
            <Switch.Option title="Daily" value="daily" />
            <Switch.Option title="Weekly" value="weekly" />
            <Switch.Option title="Monthly" value="monthly">
                {({ title, selected, style }) => (
                    <Animated.Text style={style}>
                        {selected ? `★ ${title}` : title}
                    </Animated.Text>
                )}
            </Switch.Option>
        </ControlledSwitch>
    ),
};

export const SlotOverrides: Story = {
    render: (args) => (
        <ControlledSwitch
            {...args}
            styleOverrides={{
                container: { borderRadius: 8 },
                indicator: { borderRadius: 6 },
                optionText: { textTransform: 'uppercase', fontSize: 12 },
            }}
        />
    ),
};
