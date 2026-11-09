import type { ComponentProps } from 'react';
import {
    Button,
    buttonStyleDefinition,
    createUI,
    defineButtonStyles,
    StylesProvider,
    type ButtonIconRenderProps,
    type ButtonProps,
    type ButtonStyleDefinition,
    type DefinitionContract,
} from '../src';

type Equal<A, B> =
    (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
        ? true
        : false;
function expectType<T extends true>(_value?: unknown): T {
    return true as T;
}

export const customDefinition = defineButtonStyles({
    defaultTokens: { ...buttonStyleDefinition.defaultTokens, fontSize: 14 },
    slotStyles: {
        ...buttonStyleDefinition.slotStyles,
        text: (tokens) => {
            expectType<Equal<typeof tokens.fontSize, number>>(tokens.fontSize);
            return { color: tokens.textColor, fontSize: tokens.fontSize };
        },
    },
    influenceResolvers: {
        variantResolver: {
            solid: ({ theme, size }) => {
                expectType<Equal<typeof theme, 'day' | 'night'>>(theme);
                expectType<Equal<typeof size, 'compact' | 'roomy'>>(size);
                return { radius: theme === 'day' ? 8 : 12 };
            },
            outline: {},
        },
        sizeResolver: {
            compact: ({ variant }) => {
                expectType<Equal<typeof variant, 'solid' | 'outline'>>(variant);
                return { paddingX: variant === 'solid' ? 16 : 12 };
            },
            roomy: { fontSize: 24 },
        },
        themeResolver: {
            day: {},
            night: (influences) => {
                // @ts-expect-error An influence callback cannot read its own influence.
                expectType<true>(influences.theme);
                return { textColor: '#fff' };
            },
        },
    },
    stateResolvers: {
        pressed: ({ variant, size, theme }) => {
            expectType<Equal<typeof variant, 'solid' | 'outline'>>(variant);
            expectType<Equal<typeof size, 'compact' | 'roomy'>>(size);
            expectType<Equal<typeof theme, 'day' | 'night'>>(theme);
            // @ts-expect-error Removed preset names are not part of this definition.
            expectType<true>(variant === 'primary');
            return { bgColor: theme === 'night' ? '#333' : '#eee' };
        },
    },
});

type Contract = DefinitionContract<typeof customDefinition>;
expectType<Equal<Contract['influences']['variant'], 'solid' | 'outline'>>();
expectType<Equal<Contract['influences']['size'], 'compact' | 'roomy'>>();
expectType<Equal<Contract['influences']['theme'], 'day' | 'night'>>();

const custom = createUI({
    Button: {
        definition: customDefinition,
        defaults: { variant: 'solid', size: 'compact', theme: 'day' },
    },
});

type Props = ComponentProps<typeof custom.Button>;
expectType<Equal<Props['variant'], 'solid' | 'outline' | undefined>>();
expectType<Equal<Props['size'], 'compact' | 'roomy' | undefined>>();
expectType<Equal<Props['theme'], 'day' | 'night' | undefined>>();
expectType<Equal<ComponentProps<typeof Button>, ButtonProps>>();

// These expressions are checked, not executed as tests.
export const customUsage = (
    <custom.StylesProvider>
        <custom.Button variant="outline" size="roomy" theme="night">
            <custom.Button.Text>Custom</custom.Button.Text>
            <custom.Button.Icon>
                {({ tokens, pressed, disabled, style }) => {
                    expectType<Equal<typeof tokens.fontSize, number>>(
                        tokens.fontSize
                    );
                    expectType<Equal<typeof pressed, boolean>>(pressed);
                    expectType<Equal<typeof disabled, boolean>>(disabled);
                    expectType<
                        Equal<typeof style, ButtonIconRenderProps['style']>
                    >(style);
                    // @ts-expect-error Final tokens are readonly.
                    tokens.fontSize = 10;
                    return null;
                }}
            </custom.Button.Icon>
        </custom.Button>
    </custom.StylesProvider>
);

// @ts-expect-error The custom button does not inherit default variant names.
export const wrongVariant = <custom.Button variant="primary" />;
// @ts-expect-error The custom button does not inherit default size names.
export const wrongSize = <custom.Button size="small" />;
// @ts-expect-error The custom button does not inherit default theme names.
export const wrongTheme = <custom.Button theme="light" />;
export const wrongIcon = (
    // @ts-expect-error Image sources and custom icon children are exclusive.
    <custom.Button.Icon source={{ uri: 'icon' }}>Text</custom.Button.Icon>
);

export const defaultsUsage = (
    <StylesProvider>
        <Button variant="primary" size="small" theme="light" />
    </StylesProvider>
);

createUI({
    Button: {
        definition: customDefinition,
        // @ts-expect-error Invalid defaults must not widen the inferred variant.
        defaults: { variant: 'primary', size: 'compact', theme: 'day' },
    },
});
createUI({
    Button: {
        definition: customDefinition,
        // @ts-expect-error All influences require configured defaults.
        defaults: { variant: 'solid', size: 'compact' },
    },
});
createUI({
    Button: {
        definition: customDefinition,
        defaults: { variant: 'solid', size: 'compact', theme: 'day' },
    },
    // @ts-expect-error Only implemented components are accepted.
    Switch: {},
});

const replacement: typeof customDefinition = {
    ...customDefinition,
    defaultTokens: { ...customDefinition.defaultTokens, fontSize: 99 },
};
export const providerOverride = (
    <custom.StylesProvider styles={{ Button: replacement }}>
        <custom.Button />
    </custom.StylesProvider>
);
export const wrongProvider = (
    // @ts-expect-error Provider styles must retain the configured influence contract.
    <custom.StylesProvider styles={{ Button: buttonStyleDefinition }}>
        <custom.Button />
    </custom.StylesProvider>
);

export function useCustomFixture() {
    const result = custom.useResolveComponentStyles('Button', {
        influencers: { variant: 'outline', size: 'compact', theme: 'night' },
        states: { pressed: true, disabled: false },
        overrides: { text: { fontWeight: '700' } },
    });
    expectType<Equal<typeof result.tokens.fontSize, number>>();
    custom.useResolveComponentStyles('Button', {
        // @ts-expect-error Hook influences use the custom names too.
        influencers: { variant: 'primary', size: 'compact', theme: 'night' },
    });
    // @ts-expect-error Unknown components are rejected by the bound hook.
    custom.useResolveComponentStyles('Switch', {});
    custom.useResolveComponentStyles('Button', {
        influencers: { variant: 'solid', size: 'roomy', theme: 'day' },
        // @ts-expect-error Fixed interaction states are retained.
        states: { hovered: true },
    });
    return result;
}

const sparse: ButtonStyleDefinition<'quiet' | 'loud', 'one', 'brand'> = {
    defaultTokens: buttonStyleDefinition.defaultTokens,
    slotStyles: buttonStyleDefinition.slotStyles,
    influenceResolvers: {},
    stateResolvers: {
        pressed: ({ variant }) => ({ fontSize: variant === 'loud' ? 22 : 14 }),
    },
};
const sparseUI = createUI({
    Button: {
        definition: sparse,
        defaults: { variant: 'quiet', size: 'one', theme: 'brand' },
    },
});
export const sparseUsage = <sparseUI.Button variant="loud" />;
// @ts-expect-error Sparse definitions still retain their complete contract.
export const wrongSparseUsage = <sparseUI.Button variant="solid" />;
