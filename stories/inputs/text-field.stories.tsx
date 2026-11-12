import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Text } from 'react-native';
import { type TextFieldProps } from 'rn-cuic';
import { withRenderContainer } from '../helpers/render-container';
import { TextField } from '../helpers/ui';

const meta = {
    title: 'Inputs/TextField',
    component: TextField,
    decorators: [withRenderContainer],
    args: {
        header: 'Email',
        placeholder: 'you@example.com',
        theme: 'light',
        disabled: false,
    },
    argTypes: {
        theme: { control: 'select', options: ['light', 'dark'] },
        disabled: { control: 'boolean' },
        onChangeText: { action: 'changed' },
    },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledTextField(props: TextFieldProps) {
    const [value, setValue] = useState('');
    return (
        <TextField
            {...props}
            value={value}
            onChangeText={(text) => {
                setValue(text);
                props.onChangeText?.(text);
            }}
        />
    );
}

export const Default: Story = {
    render: (args) => <ControlledTextField {...args} />,
};

export const WithFeedback: Story = {
    args: { feedback: 'We never share your email.' },
    render: (args) => <ControlledTextField {...args} />,
};

export const WarningFeedback: Story = {
    args: {
        feedback: { message: 'Check this field.', variant: 'warning' },
    },
};

export const ErrorFeedback: Story = {
    args: {
        feedback: { message: 'This field is required.', variant: 'error' },
    },
};

export const Disabled: Story = {
    args: { disabled: true, value: 'Read only' },
};

export const ValidateOnBlur: Story = {
    args: {
        validation: {
            showFeedbackOn: 'blur',
            validator: (text) =>
                text.includes('@')
                    ? { valid: true }
                    : {
                          valid: false,
                          variant: 'error',
                          message: 'Enter a valid email.',
                      },
        },
    },
    render: (args) => <ControlledTextField {...args} />,
};

export const CompoundSlots: Story = {
    args: { header: undefined },
    render: (args) => (
        <ControlledTextField {...args}>
            <TextField.Header style={{ fontWeight: '600' }}>
                Email address
            </TextField.Header>
            <TextField.Input style={{ borderRadius: 2 }} />
            <TextField.Feedback>
                {({ message, variant, style }) => (
                    <Text style={style}>
                        {variant === 'error' ? '⚠ ' : ''}
                        {message ?? 'Used for sign-in only.'}
                    </Text>
                )}
            </TextField.Feedback>
        </ControlledTextField>
    ),
};
