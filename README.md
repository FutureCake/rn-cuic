# rn-cuic

Customizable UI Components for React Native: a usable default preset out of the
box, typed style overrides at every level, ambient theming, and factory-built
component families when you need your own variant, size, and theme vocabularies.

## Installation

rn-cuic uses React Native Gesture Handler 2, Reanimated 4, and React Native
Worklets. These are peer dependencies so the consuming app owns the native
versions; they are not bundled into the library. Reanimated 4 requires React
Native's New Architecture.

### Expo

Install rn-cuic, then let Expo select SDK-compatible native dependencies:

```sh
npm install rn-cuic
npx expo install react-native-gesture-handler react-native-reanimated react-native-worklets
```

With `babel-preset-expo`, the Worklets Babel plugin is configured automatically.
The example app uses Expo SDK 57 with Gesture Handler 2.32, Reanimated 4.5.1,
and Worklets 0.10.1.

### React Native without Expo

```sh
npm install rn-cuic react-native-gesture-handler@^2.32.0 react-native-reanimated@^4.5.1 react-native-worklets@~0.10.1
cd ios && bundle exec pod install
```

Add `react-native-worklets/plugin` **last** in your app's Babel `plugins` array
(not the legacy `react-native-reanimated/plugin`). Follow the
[Reanimated setup guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)
for React Native and Worklets version compatibility.

### App root

Wrap your app in `GestureHandlerRootView`, keeping `flex: 1` so it fills the
screen:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* Your app and rn-cuic components */}
        </GestureHandlerRootView>
    );
}
```

Restart Metro with its cache cleared after changing Babel configuration. Rebuild
custom native apps after adding or changing native dependencies.

## Quick start

Call `createUI` once at module scope, passing a factory per component your app
uses. A factory called with no arguments applies that component's preset:

```tsx
import { buttonFactory, createUI } from 'rn-cuic';

const { Button, StylesProvider } = createUI({
    theme: 'light',
    components: {
        Button: buttonFactory(),
    },
});

export function App() {
    return (
        <StylesProvider>
            <Button text="Continue" onPress={submit} />
        </StylesProvider>
    );
}
```

The default `Button` accepts `variant` (`'primary' | 'secondary'`), `size`
(`'small' | 'large' | 'xlarge'`), `disabled`, an optional per-instance `theme`,
and the native `Pressable` props. Pressed/disabled styling and animated style
transitions are built in. Components and hooks throw when used outside their
matching `StylesProvider`.

## Smaller bundles: subpath imports

Importing from the root `'rn-cuic'` pulls every component into the bundle
(Metro does not tree-shake). The subpath entries expose the exact same API but
bundle only what you import:

```tsx
import { buttonFactory } from 'rn-cuic/button';
import { createUI } from 'rn-cuic/core';

const { Button, StylesProvider } = createUI({
    theme: 'light',
    components: {
        Button: buttonFactory(),
    },
});
```

A factory with no arguments selects the preset; pass `{ definition, defaults }`
for a custom family. `rn-cuic/core` exports `createUI`, the styles manager, and
the shared utilities; `rn-cuic/button`, `rn-cuic/chip`, `rn-cuic/toggle`,
`rn-cuic/switch`, and `rn-cuic/text-field` each export their factory,
`define<Component>Styles`, the preset definition, and all component types.

## Theming

The theme is ambient: `StylesProvider` owns it and every component inside
follows it. `useTheme` reads and updates it from anywhere in the subtree:

```tsx
import { buttonFactory, createUI } from 'rn-cuic';

const { Button, StylesProvider, useTheme } = createUI({
    theme: 'light',
    components: {
        Button: buttonFactory(),
    },
});

function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    return (
        <Button
            variant="secondary"
            text={`Switch to ${theme === 'light' ? 'dark' : 'light'}`}
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />
    );
}

export function App() {
    return (
        <StylesProvider>
            <ThemeSwitch />
        </StylesProvider>
    );
}
```

- The provider starts at the `createUI` config's `theme` (`'light'` in the
  examples above).
- Pass `theme` to the provider to drive it from app state instead; the prop
  takes precedence over `setTheme`: `<StylesProvider theme={colorScheme}>`.
- A `theme` prop on a single component instance overrides the ambient theme for
  that instance only.

## Overriding styles

Three levels, from narrowest to widest.

### 1. Per instance: `styleOverrides`

Each component exposes a slot-typed `styleOverrides` prop, applied after the
resolved slot styles. Button's slots are `container`, `text`, and `icon`:

```tsx
<Button
    text="Save"
    styleOverrides={{
        container: { borderRadius: 24 },
        text: { fontWeight: '700' },
    }}
/>
```

Slot parts also accept a local `style`, applied after `styleOverrides`.

### 2. Per subtree: partial definitions on the provider

The provider's `styles` prop accepts partial per-component overrides, merged
key-by-key over the factory's definitions. Everything you do not mention keeps
its default:

```tsx
<StylesProvider
    styles={{
        Button: {
            defaultTokens: { radius: 24 },
            influenceResolvers: {
                variant: { secondary: { textColor: '#4338ca' } },
            },
        },
    }}
>
    {/* Buttons here are rounded; everything else is unchanged. */}
</StylesProvider>
```

Merging is per section entry: the `variant.secondary` resolver above replaces
the default secondary resolver, while `variant.primary`, all sizes, themes, and
state resolvers stay default. Overrides can change styling, not the allowed
prop values or defaults.

### 3. Per family: a custom definition

Replace the whole definition through `createUI`, including your own variant,
size, and theme names — next section.

## Custom Button families

`createUI` builds an independent family: a `Button` bound to your definition,
plus its own `StylesProvider`, `useTheme`, and `useResolveComponentStyles`.
For Button it customizes the allowed **values** of the fixed `variant`, `size`,
and `theme` props, not their names. Tokens, states (`pressed`/`disabled`),
slots (`container`/`text`/`icon`), and native behavior stay fixed.

Define and re-export a family once, **at module scope**, never inside a
component. `defineButtonStyles` infers the value unions from the keys of the
required `variant`, `size`, and `theme` resolver maps. Every supported value
needs an entry; `{}` declares one without token overrides.

```tsx
import {
    buttonFactory,
    buttonStyleDefinition,
    createUI,
    defineButtonStyles,
} from 'rn-cuic';

export const buttonDefinition = defineButtonStyles({
    defaultTokens: {
        ...buttonStyleDefinition.defaultTokens,
        fontSize: 16,
        radius: 12,
        bgColor: '#4f46e5',
        textColor: '#ffffff',
        iconColor: '#ffffff',
    },
    influenceResolvers: {
        variant: {
            solid: {},
            outline: ({ theme }) => ({
                bgColor: 'transparent',
                textColor: theme === 'day' ? '#4338ca' : '#c7d2fe',
                iconColor: theme === 'day' ? '#4338ca' : '#c7d2fe',
            }),
        },
        size: {
            // A size resolver reads the other influences, not its own.
            compact: ({ variant }) => ({
                fontSize: 14,
                paddingX: variant === 'outline' ? 12 : 16,
                iconSize: 16,
            }),
            roomy: { fontSize: 18, paddingX: 24, paddingY: 14, iconSize: 22 },
        },
        theme: {
            day: {},
            night: {
                bgColor: '#c7d2fe',
                textColor: '#111827',
                iconColor: '#111827',
            },
        },
    },
    stateResolvers: {
        pressed: ({ variant, theme }) => ({
            bgColor:
                variant === 'outline'
                    ? 'transparent'
                    : theme === 'day'
                      ? '#3730a3'
                      : '#a5b4fc',
        }),
        disabled: {
            bgColor: '#e5e7eb',
            textColor: '#9ca3af',
            iconColor: '#9ca3af',
        },
    },
    slotStyles: buttonStyleDefinition.slotStyles,
    transition: buttonStyleDefinition.transition,
});

export const {
    Button: AppButton,
    StylesProvider: AppStylesProvider,
    useTheme: useAppTheme,
} = createUI({
    theme: 'day',
    components: {
        Button: buttonFactory({
            definition: buttonDefinition,
            defaults: { variant: 'solid', size: 'compact' },
        }),
    },
});
```

`theme` is the family's initial ambient theme; `defaults` fill in omitted
`variant`/`size` props. All are checked against the definition's inferred value
unions. Use the family's own provider and compound parts:

```tsx
import { AppButton, AppStylesProvider } from './ui';

export function App() {
    return (
        <AppStylesProvider>
            <AppButton text="Defaults: solid / compact / day" />
            <AppButton variant="outline" size="roomy">
                <AppButton.Text>Continue</AppButton.Text>
            </AppButton>
        </AppStylesProvider>
    );
}
```

Each `createUI` call returns an independent family. A component or hook without
its **own matching provider** throws, even inside another family's provider.
Do not mix compound parts from different families. The library ships no
pre-built component instances: every app calls `createUI`, and a factory called
without a `definition` uses its preset (`buttonStyleDefinition`, …). Preset
fallbacks resolve the `light`/`dark` themes, so supply a definition for every
selected component when using custom theme names.

## Button slots

The text shorthand remains available, with an optional leading image:

```tsx
<Button text="Save" icon={saveImage} onPress={save} />
```

For composition, use `Button.Text` and `Button.Icon`. Both read resolved styles
from the nearest Button through a private context, including pressed/disabled
changes. They work through wrappers and fragments; using a part outside Button
throws. The root accepts shorthand `text`/`icon` together with explicit
children; each explicit part overrides only its corresponding prop:

```tsx
<Button onPress={save}>
    <Button.Icon source={saveImage} />
    <Button.Text>Save</Button.Text>
</Button>

<Button onPress={save} accessibilityLabel="Save">
    <Button.Icon source={saveImage} />
</Button>
```

With no overrides, shorthand order is icon then text. When both parts are
supplied as children, their order of appearance wins. Every explicit part is
retained, including multiple instances of the same part; the corresponding
fallback is omitted only once.

Override detection recognizes direct parts, arrays, and fragments — not parts
hidden inside wrappers or custom components. Such nested parts still consume
context and render correctly, but do not suppress the shorthand fallback.
Children are never cloned or reordered; any fallback icon goes before all
children and any fallback text goes after them. An explicit empty part also
suppresses its fallback; a conditional `false`/`null` child does not.

Native text/image props are forwarded by the built-in parts. Built-in images
are decorative (`accessible={false}`) by default. Provide an accessible label
for icon-only buttons.

### Custom icon rendering

`Button.Icon` accepts an image `source`, ordinary children, or a
render-function child. Source and children are mutually exclusive. Plain
children render unchanged, without a wrapper or automatic styles. A render
function receives the complete resolved `tokens`, composed icon `style`, and
effective `pressed`/`disabled` state:

```tsx
<Button onPress={save}>
    <Button.Icon>
        {({ tokens }) => (
            <SaveSvg
                width={tokens.iconSize}
                height={tokens.iconSize}
                fill={tokens.iconColor}
            />
        )}
    </Button.Icon>
    <Button.Text>Save</Button.Text>
</Button>
```

Custom renderers map tokens/styles to their renderer's API and own their
accessibility and animation behavior. To honor slot or local style overrides,
use the supplied `style` (mapping image properties such as `tintColor` as
needed), rather than relying only on tokens.

## Custom components

The library does not register or wrap third-party components. Build them as
ordinary React components on top of the same resolver the built-ins use.
`createStylesManager(definitions, defaultTheme)` creates an isolated
`StylesProvider`, `useTheme`, and `useResolveComponentStyles` bound to your
definitions — the same machinery `createUI` uses internally:

```tsx
import { Text, type TextProps, type TextStyle } from 'react-native';
import {
    createStylesManager,
    type StyleDefinition,
    type StyleOverrides,
} from 'rn-cuic';

type BadgeSlotStyles = { text: TextStyle };

const badgeDefinition: StyleDefinition<
    { tone: 'info' | 'success' },
    { color: string },
    never,
    BadgeSlotStyles
> = {
    defaultTokens: { color: '#2563eb' },
    influenceResolvers: {
        tone: {
            info: {},
            success: { color: '#15803d' },
        },
    },
    stateResolvers: {},
    slotStyles: {
        text: ({ color }) => ({ color }),
    },
};

export const { StylesProvider, useTheme, useResolveComponentStyles } =
    createStylesManager({ Badge: badgeDefinition }, 'light');

type BadgeProps = TextProps & {
    tone?: 'info' | 'success';
    styleOverrides?: StyleOverrides<BadgeSlotStyles>;
};

export function Badge({
    tone = 'info',
    styleOverrides,
    style,
    ...props
}: BadgeProps) {
    const { styles } = useResolveComponentStyles('Badge', {
        influences: { tone },
        overrides: styleOverrides,
    });
    return <Text {...props} style={[styles.text, style]} />;
}
```

Each component defines its own influences, tokens, states, and slots; none of
Button's props are imposed. Influence values must be strings, numbers, or
symbols; boolean interaction flags belong in `states`. Annotate custom
definitions with `StyleDefinition<Influences, Tokens, States, SlotStyles>` (as
above) so sparse resolver maps still retain the complete typed contract.
Components own prop defaults, native prop forwarding, state tracking,
accessibility, animation, and rendering; definitions alone do not generate
that behavior.

## Resolution model

Resolution starts from the required, complete `defaultTokens`, merges the
selected entry from each influence resolver group in declaration order, merges
active state overrides in declaration order, then invokes each slot's style
callback with the final tokens. Later merges win. Resolver entries are partial
tokens or pure callbacks; influence callbacks receive the other influences
(never their own), state callbacks receive all influences.

An influence value without a matching resolver entry applies no overrides and
logs a development-only warning. Reanimated's `transition` configuration is
spread into every returned slot: apply those styles to `Animated` elements to
animate style changes. The manager does not manage interaction state, worklets,
native behavior, or accessibility.

`useResolveComponentStyles` and the pure `resolveComponentStyles` return
`{ styles, tokens }`. Tokens are read-only and include defaults, influences,
and active states; slot-level `styleOverrides` and local part styles do not
change tokens.

## Utilities

`createSlotContext<Value>(componentName)` creates an isolated typed context for
compound-component families. Call it once at module scope; it returns
`{ ContextProvider, useSlotContext }`. The hook throws without its matching
provider; its optional argument names the consuming part in errors.

```tsx
import { createSlotContext } from 'rn-cuic';

type DisclosureContext = {
    expanded: boolean;
    toggle: () => void;
};

const { ContextProvider, useSlotContext } =
    createSlotContext<DisclosureContext>('Disclosure');
```

`hasSlot(children, Part)` supports per-part fallbacks. It checks element
identity through arrays and fragments without rendering; it intentionally does
not traverse into wrapper components, so parts hidden inside custom components
are not detected.

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
