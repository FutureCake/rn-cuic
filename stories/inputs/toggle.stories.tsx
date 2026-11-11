import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Toggle, type ToggleProps } from 'rn-cuic';
import { withRenderContainer } from '../helpers/render-container';

const meta = {
    title: 'Inputs/Toggle',
    component: Toggle,
    decorators: [withRenderContainer],
    args: {
        active: false,
        theme: 'light',
        disabled: false,
    },
    argTypes: {
        active: { control: 'boolean' },
        theme: { control: 'select', options: ['light', 'dark'] },
        disabled: { control: 'boolean' },
        onChange: { action: 'changed' },
        onPress: { action: 'pressed' },
    },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled wrapper so the toggle responds to presses in the story. */
function ControlledToggle(props: Omit<ToggleProps, 'active'>) {
    const [active, setActive] = useState(false);
    return (
        <Toggle
            {...props}
            active={active}
            onChange={(value) => {
                setActive(value);
                props.onChange?.(value);
            }}
        />
    );
}

export const Default: Story = {
    render: (args) => <ControlledToggle {...args} />,
};

export const Active: Story = {
    args: { active: true },
};

export const Disabled: Story = {
    args: { active: true, disabled: true },
};

export const SlotOverrides: Story = {
    render: (args) => (
        <ControlledToggle
            {...args}
            styleOverrides={{
                container: { borderRadius: 6 },
                indicator: { borderRadius: 2 },
            }}
        />
    ),
};

/** No theme prop: follows the ambient StylesProvider theme. */
function AmbientThemeToggle() {
    const [active, setActive] = useState(false);
    return <Toggle active={active} onChange={setActive} />;
}

export const AmbientTheme: Story = {
    render: () => <AmbientThemeToggle />,
};
