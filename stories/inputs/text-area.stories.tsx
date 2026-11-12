import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Text } from 'react-native';
import { type TextAreaProps } from 'rn-cuic';
import { withRenderContainer } from '../helpers/render-container';
import { TextArea } from '../helpers/ui';

const meta = {
    title: 'Inputs/TextArea',
    component: TextArea,
    decorators: [withRenderContainer],
    args: {
        header: 'Bio',
        placeholder: 'Tell us about yourself…',
        theme: 'light',
        disabled: false,
        numLines: 4,
    },
    argTypes: {
        theme: { control: 'select', options: ['light', 'dark'] },
        disabled: { control: 'boolean' },
        numLines: { control: 'number' },
        onChangeText: { action: 'changed' },
    },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledTextArea(props: TextAreaProps) {
    const [value, setValue] = useState('');
    return (
        <TextArea
            {...props}
            value={value}
            onChangeText={(text) => {
                setValue(text);
                props.onChangeText?.(text);
            }}
        />
    );
}

/** Fixed at numLines; overflowing content scrolls inside the field. */
export const Default: Story = {
    render: (args) => <ControlledTextArea {...args} />,
};

/** Starts at numLines and grows without bound as content wraps. */
export const Grow: Story = {
    args: { grow: true, numLines: 2 },
    render: (args) => <ControlledTextArea {...args} />,
};

/** maxLines alone implies grow; past the cap the content scrolls. */
export const GrowCapped: Story = {
    args: { numLines: 2, maxLines: 6 },
    render: (args) => <ControlledTextArea {...args} />,
};

export const WithFeedback: Story = {
    args: { feedback: 'Markdown is not supported.' },
    render: (args) => <ControlledTextArea {...args} />,
};

export const Disabled: Story = {
    args: { disabled: true, value: 'Read only' },
};

export const ValidateOnBlur: Story = {
    args: {
        grow: true,
        validation: {
            showFeedbackOn: 'blur',
            validator: (text) =>
                text.length >= 10
                    ? { valid: true }
                    : {
                          valid: false,
                          variant: 'error',
                          message: 'Write at least 10 characters.',
                      },
        },
    },
    render: (args) => <ControlledTextArea {...args} />,
};

export const CompoundSlots: Story = {
    args: { header: undefined, grow: true },
    render: (args) => (
        <ControlledTextArea {...args}>
            <TextArea.Header style={{ fontWeight: '600' }}>
                About you
            </TextArea.Header>
            <TextArea.Input style={{ borderRadius: 2 }} />
            <TextArea.Feedback>
                {({ message, variant, style }) => (
                    <Text style={style}>
                        {variant === 'error' ? '⚠ ' : ''}
                        {message ?? 'Shown on your public profile.'}
                    </Text>
                )}
            </TextArea.Feedback>
        </ControlledTextArea>
    ),
};
