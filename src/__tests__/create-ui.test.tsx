import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';
import {
    Button,
    StylesProvider,
    buttonStyleDefinition,
    componentStyles,
    createUI,
    defineButtonStyles,
    resolveComponentStyles,
} from '../index';

const definition = defineButtonStyles({
    defaultTokens: { ...buttonStyleDefinition.defaultTokens, fontSize: 14 },
    slotStyles: buttonStyleDefinition.slotStyles,
    influenceOrder: ['theme', 'variant', 'size'],
    stateOrder: ['pressed', 'disabled'],
    influenceResolvers: {
        variantResolver: {
            solid: { radius: 8 },
            outline: { bgColor: 'transparent' },
        },
        sizeResolver: {
            compact: ({ variant }) => ({
                paddingX: variant === 'solid' ? 16 : 12,
            }),
            roomy: { fontSize: 24 },
        },
        themeResolver: { day: { bgColor: '#eee' }, night: { bgColor: '#222' } },
    },
    stateResolvers: {
        pressed: ({ theme }) => ({
            bgColor: theme === 'night' ? '#444' : '#ccc',
        }),
        disabled: { bgColor: '#999' },
    },
});
const ui = createUI({
    Button: {
        definition,
        defaults: { variant: 'solid', size: 'compact', theme: 'day' },
    },
});

describe('createUI', () => {
    it('preserves the default preset and direct Button imports', async () => {
        expect(componentStyles.Button).toBe(buttonStyleDefinition);
        await render(
            <StylesProvider>
                <Button text="Default" testID="default" />
            </StylesProvider>
        );
        const expected = resolveComponentStyles(buttonStyleDefinition, {
            influencers: { variant: 'primary', size: 'small', theme: 'light' },
        });
        // Reanimated consumes transition settings before forwarding native styles.
        const nativeStyles = (style: object) =>
            Object.fromEntries(
                Object.entries(style).filter(
                    ([key]) => !key.startsWith('transition')
                )
            );
        expect(
            StyleSheet.flatten(screen.getByTestId('default').props.style)
        ).toEqual(
            nativeStyles(StyleSheet.flatten(expected.styles.container) ?? {})
        );
        expect(
            StyleSheet.flatten(screen.getByText('Default').props.style)
        ).toEqual(nativeStyles(StyleSheet.flatten(expected.styles.text) ?? {}));
    });

    it('uses custom defaults and lets explicit props override them', async () => {
        await render(
            <ui.StylesProvider>
                <ui.Button text="Custom" testID="custom" />
            </ui.StylesProvider>
        );
        expect(screen.getByTestId('custom')).toHaveStyle({
            backgroundColor: '#eee',
            paddingHorizontal: 16,
        });
        expect(screen.getByText('Custom')).toHaveStyle({ fontSize: 14 });
        await screen.rerender(
            <ui.StylesProvider>
                <ui.Button
                    variant="outline"
                    size="roomy"
                    theme="night"
                    text="Custom"
                    testID="custom"
                />
            </ui.StylesProvider>
        );
        expect(screen.getByTestId('custom')).toHaveStyle({
            backgroundColor: 'transparent',
        });
        expect(screen.getByText('Custom')).toHaveStyle({ fontSize: 24 });
    });

    it('re-resolves provider overrides and keeps separate factories isolated', async () => {
        const other = createUI({
            Button: {
                definition: buttonStyleDefinition,
                defaults: {
                    variant: 'secondary',
                    size: 'large',
                    theme: 'dark',
                },
            },
        });
        const tree = (bgColor: string) => (
            <ui.StylesProvider
                styles={{
                    Button: {
                        ...definition,
                        influenceResolvers: {
                            ...definition.influenceResolvers,
                            themeResolver: { day: { bgColor } },
                        },
                    },
                }}
            >
                <other.StylesProvider>
                    <ui.Button text="First" testID="first" />
                    <other.Button text="Second" testID="second" />
                </other.StylesProvider>
            </ui.StylesProvider>
        );
        await render(tree('#f00'));
        expect(screen.getByTestId('first')).toHaveStyle({
            backgroundColor: '#f00',
        });
        expect(screen.getByTestId('second')).toHaveStyle({
            backgroundColor: 'transparent',
        });
        await screen.rerender(tree('#00f'));
        expect(screen.getByTestId('first')).toHaveStyle({
            backgroundColor: '#00f',
        });
        expect(screen.getByTestId('second')).toHaveStyle({
            backgroundColor: 'transparent',
        });
    });

    it('publishes state to render props and forwards press/native accessibility props', async () => {
        const onPressIn = jest.fn();
        const onPressOut = jest.fn();
        const onPress = jest.fn();
        const tree = (disabled = false) => (
            <ui.StylesProvider>
                <ui.Button
                    testID="press"
                    accessibilityLabel="Save"
                    accessibilityState={{ busy: true }}
                    disabled={disabled}
                    onPress={onPress}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    styleOverrides={{ icon: { width: 42 } }}
                >
                    <ui.Button.Icon>
                        {({ tokens, pressed, disabled: inactive, style }) => (
                            <Text testID="state">
                                {JSON.stringify({
                                    color: tokens.bgColor,
                                    pressed,
                                    inactive,
                                    style,
                                })}
                            </Text>
                        )}
                    </ui.Button.Icon>
                </ui.Button>
            </ui.StylesProvider>
        );
        await render(tree());
        expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
        expect(screen.getByTestId('press').props.accessibilityState).toEqual({
            busy: true,
            disabled: false,
        });
        await fireEvent(screen.getByTestId('press'), 'pressIn');
        expect(onPressIn).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('press')).toHaveStyle({
            backgroundColor: '#ccc',
        });
        expect(screen.getByTestId('state').props.children).toContain(
            '"pressed":true'
        );
        expect(screen.getByTestId('state').props.children).toContain(
            '"width":42'
        );
        await fireEvent.press(screen.getByTestId('press'));
        expect(onPress).toHaveBeenCalledTimes(1);
        await fireEvent(screen.getByTestId('press'), 'pressOut');
        expect(onPressOut).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('press')).toHaveStyle({
            backgroundColor: '#eee',
        });
        await screen.rerender(tree(true));
        expect(screen.getByTestId('press')).toBeDisabled();
        expect(screen.getByTestId('press')).toHaveStyle({
            backgroundColor: '#999',
        });
        expect(screen.getByTestId('state').props.children).toContain(
            '"inactive":true'
        );
        await fireEvent.press(screen.getByTestId('press'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('rejects a missing provider and another factory provider', async () => {
        const error = jest.spyOn(console, 'error').mockImplementation(() => {});
        try {
            await expect(render(<ui.Button />)).rejects.toThrow(
                'within StylesProvider'
            );
            await expect(
                render(
                    <StylesProvider>
                        <ui.Button />
                    </StylesProvider>
                )
            ).rejects.toThrow('within StylesProvider');
        } finally {
            error.mockRestore();
        }
    });
});
