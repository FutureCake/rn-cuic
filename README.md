# rn-cuic

Customizable UI Components for react native

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
custom native apps after adding or changing native dependencies. Expo Go can be
used when its bundled native versions match your SDK-compatible dependencies.

## Typed component styles

The library's `StylesProvider` and `useResolveComponentStyles` share a typed
component collection. Currently `Button` is registered:

```tsx
import { Button, StylesProvider, componentStyles } from 'rn-cuic';

function App() {
    return (
        <StylesProvider styles={componentStyles}>
            <Button text="Continue" theme="dark" />
        </StylesProvider>
    );
}
```

Inside a component:

```tsx
const { styles, tokens } = useResolveComponentStyles('Button', {
    influencers: { variant: 'primary', size: 'small', theme: 'dark' },
    states: { pressed: true, disabled: false },
});
// styles.container is ViewStyle + Reanimated transition settings.
// styles.text is TextStyle + Reanimated transition settings.
// tokens.iconSize and tokens.iconColor include active state overrides.
```

Component names, influence names/values, state names, and returned slots are
associated by TypeScript. For custom components, the low-level
`createStylesManager({ Button: buttonDefinition, TextInput: inputDefinition })`
creates an isolated `StylesProvider` and `useResolveComponentStyles` pair when
called once at module scope. Custom components must call that returned hook;
this does **not** rebind the library's `Button` or change its accepted props.
Use `createUI` below to configure built-in and custom components in one collection.
Annotate each low-level definition with
`StyleDefinition<Influences, Tokens, States, SlotStyles>` so optional resolvers
still retain the complete component contract. Use a type annotation,
not only `satisfies`, to retain that contract on an otherwise sparse definition.
The provider accepts an optional `styles` collection of the same type and
defaults to the factory's collection. A hook outside its provider throws.
Replacing the provider's collection re-resolves consuming components.

Resolution starts with required, complete `defaultTokens`, merges the selected
influence entries, then merges active state overrides before invoking each
slot's style callback. Optional `influenceOrder` and `stateOrder` control merge
precedence (later overrides win); unspecified entries follow declaration order.
All matching influence values in a state map apply. State maps can also be direct
partial tokens or callbacks. Token names should not overlap influence value keys;
for ambiguous definitions use a direct state callback. Flattened state maps
cannot distinguish two influences that share the same value.

Influence callbacks receive the other influences, excluding their own; state
callbacks receive all influences. Callbacks should be pure. Reanimated's
`transition` configuration is spread into every returned slot: apply those styles
to `Animated` elements to animate style changes. The manager itself does not
manage interaction state, worklets, native behavior, or accessibility. Button
owns its pressed/disabled behavior and applies its slot styles to animated
elements.

### Resolver return migration

`useResolveComponentStyles` and the pure `resolveComponentStyles` now return
`{ styles, tokens }` instead of a bare slot-style map. Existing callers must
destructure `styles` before accessing slots. Tokens are typed as read-only and
include defaults, influences, and active states. Slot-level `styleOverrides`
and local part styles do not change these tokens.

## Configured Button families

`Button` is currently the only built-in registration; custom components can be
registered as described below. For Button, `createUI` customizes the allowed values
of the fixed props `variant`, `size`, and `theme`, not their names. Button's
tokens, states (`pressed`/`disabled`), slots (`container`/`text`/`icon`), and native
behavior stay fixed. The default library exports remain unchanged, including
their `primary`/`small`/`light` defaults.

Define and re-export an application UI family once, **at module scope**, never
inside a component. `defineButtonStyles` infers the value unions from the keys
of the **required** `variantResolver`, `sizeResolver`, and `themeResolver` maps.
Every supported value needs an entry; `{}` declares one without token overrides.
The helper returns `ButtonStyleDefinition<V, S, T>`, preserving the full typed
contract rather than just the input object's shape.

```tsx
import { buttonStyleDefinition, createUI, defineButtonStyles } from 'rn-cuic';

export const buttonDefinition = defineButtonStyles({
    defaultTokens: {
        ...buttonStyleDefinition.defaultTokens,
        fontSize: 16,
        paddingX: 16,
        paddingY: 8,
        iconGap: 8,
        iconSize: 18,
        radius: 12,
        bgColor: '#4f46e5',
        textColor: '#ffffff',
        iconColor: '#ffffff',
    },
    influenceOrder: ['theme', 'variant', 'size'],
    stateOrder: ['pressed', 'disabled'],
    // Replace both resolver groups, rather than spreading preset callbacks
    // that expect primary/secondary, small/large, and light/dark.
    influenceResolvers: {
        variantResolver: {
            solid: {},
            outline: ({ theme }) => ({
                bgColor: 'transparent',
                textColor: theme === 'day' ? '#4338ca' : '#c7d2fe',
                iconColor: theme === 'day' ? '#4338ca' : '#c7d2fe',
            }),
        },
        sizeResolver: {
            // variant: 'solid' | 'outline'; theme: 'day' | 'night'.
            // A size resolver cannot read its own size influence.
            compact: ({ variant, theme }) => ({
                fontSize: 14,
                paddingX: variant === 'outline' ? 12 : 16,
                paddingY: theme === 'night' ? 9 : 8,
                iconSize: 16,
            }),
            roomy: { fontSize: 18, paddingX: 24, paddingY: 14, iconSize: 22 },
        },
        themeResolver: {
            day: {},
            night: {
                bgColor: '#c7d2fe',
                textColor: '#111827',
                iconColor: '#111827',
            },
        },
    },
    stateResolvers: {
        // State callbacks receive all three fully typed influences.
        pressed: ({ variant, size, theme }) => ({
            bgColor:
                variant === 'outline'
                    ? 'transparent'
                    : theme === 'day'
                      ? '#3730a3'
                      : '#a5b4fc',
            radius: size === 'roomy' ? 16 : 10,
        }),
        disabled: ({ variant, theme }) => ({
            bgColor:
                variant === 'outline'
                    ? 'transparent'
                    : theme === 'day'
                      ? '#e5e7eb'
                      : '#374151',
            textColor: '#9ca3af',
            iconColor: '#9ca3af',
        }),
    },
    slotStyles: {
        ...buttonStyleDefinition.slotStyles,
        container: (tokens) => ({
            ...buttonStyleDefinition.slotStyles.container(tokens),
            borderWidth: 1,
            borderColor:
                tokens.bgColor === 'transparent'
                    ? tokens.textColor
                    : 'transparent',
        }),
    },
    transition: buttonStyleDefinition.transition,
});

export const {
    Button: AppButton,
    StylesProvider: AppStylesProvider,
    useResolveComponentStyles: useAppStyles,
} = createUI({
    Button: {
        definition: buttonDefinition,
        defaults: { variant: 'solid', size: 'compact', theme: 'day' },
    },
});
```

All three defaults are required and checked against the definition's inferred
values. Omitted Button props use these defaults; explicit props override them.
The bound hook uses the same contract (its `influencers` object still requires
all three values). Use this family's own provider and compound parts:

```tsx
import { ActivityIndicator } from 'react-native';
import { AppButton, AppStylesProvider } from './ui';

export function App() {
    return (
        <AppStylesProvider>
            <AppButton text="Factory defaults: solid / compact / day" />
            <AppButton variant="outline" size="roomy" theme="night">
                <AppButton.Icon>
                    {({ tokens }) => (
                        <ActivityIndicator
                            color={tokens.iconColor}
                            size={tokens.iconSize}
                            accessibilityLabel="Loading"
                        />
                    )}
                </AppButton.Icon>
                <AppButton.Text>Continue</AppButton.Text>
            </AppButton>
        </AppStylesProvider>
    );
}
```

Each call returns an independent `Button`, `StylesProvider`, and hook. Calling
`createUI` twice allows different value sets in one app. For example, a second
module-scope family can use the default preset alongside the custom one:

```tsx
import { buttonStyleDefinition, createUI } from 'rn-cuic';
import { AppButton, AppStylesProvider } from './ui';

export const PresetUI = createUI({
    Button: {
        definition: buttonStyleDefinition,
        defaults: { variant: 'primary', size: 'small', theme: 'light' },
    },
});

export function TwoFamilies() {
    return (
        <AppStylesProvider>
            <AppButton variant="outline" text="Custom family" />
            <PresetUI.StylesProvider>
                <PresetUI.Button text="Independent preset family" />
            </PresetUI.StylesProvider>
        </AppStylesProvider>
    );
}
```

A Button or hook without its **own matching provider** throws, even inside the
default provider or another factory's provider. Do not mix compound parts from
different families. Nesting providers does not change another family's contract.

Per-provider overrides replace the collection with a full definition of the
**same contract**. They can change styling, not the allowed prop values or the
factory's configured defaults. Other provider instances remain independent:

```tsx
import { AppButton, AppStylesProvider, buttonDefinition } from './ui';

export function RoundedSection() {
    return (
        <AppStylesProvider
            styles={{
                Button: {
                    ...buttonDefinition,
                    defaultTokens: {
                        ...buttonDefinition.defaultTokens,
                        radius: 24,
                    },
                },
            }}
        >
            <AppButton text="Same names and defaults, different radius" />
        </AppStylesProvider>
    );
}
```

For sparse maps, skip the helper and explicitly **annotate** the definition with
`ButtonStyleDefinition<Variant, Size, Theme>` (not just `satisfies`). This retains
supported names even when entries or entire resolver maps are omitted. Missing
entries add no overrides; the complete `defaultTokens` still apply:

```tsx
import { createUI } from 'rn-cuic';
import type { ButtonStyleDefinition } from 'rn-cuic';
import { buttonDefinition } from './ui';

const sparseDefinition: ButtonStyleDefinition<
    'solid' | 'outline',
    'compact' | 'roomy',
    'day' | 'night'
> = {
    defaultTokens: buttonDefinition.defaultTokens,
    influenceResolvers: { variantResolver: { solid: { radius: 20 } } },
    stateResolvers: {},
    slotStyles: buttonDefinition.slotStyles,
    transition: buttonDefinition.transition,
};

export const SparseUI = createUI({
    Button: {
        definition: sparseDefinition,
        defaults: { variant: 'outline', size: 'roomy', theme: 'night' },
    },
});
```

## Registering custom components

`createUI(config, { components: builders })` can combine consumer components and
built-ins under **one** provider. Each component has its own influences, defaults,
tokens, states and slots. None of the Button-specific props are imposed on custom
components.

A builder runs once, when `createUI` is called. It receives a copy of that
component's `defaults` and a `useStyles` hook bound to its definition and this
factory instance. It returns the actual React component. Call the hook **inside
the returned component**, not while building it.

Here is a complete Badge registration with one influence and no interaction states:

```tsx
import { Text, type TextProps, type TextStyle } from 'react-native';
import {
    buttonStyleDefinition,
    createUI,
    type StyleDefinition,
    type StyleOverrides,
    type UIComponentBuilderOptions,
    type UIComponentDefaults,
} from 'rn-cuic';

const badgeDefinition: StyleDefinition<
    { tone: 'info' | 'success' },
    { color: string },
    never,
    { text: TextStyle }
> = {
    defaultTokens: { color: '#2563eb' },
    influenceResolvers: {
        toneResolver: {
            info: {},
            success: { color: '#15803d' },
        },
    },
    stateResolvers: {},
    slotStyles: {
        text: ({ color }) => ({ color }),
    },
};

type BadgeProps = TextProps &
    Partial<UIComponentDefaults<typeof badgeDefinition>> & {
        styleOverrides?: StyleOverrides<'text'>;
    };

function createBadge({
    defaults,
    useStyles,
}: UIComponentBuilderOptions<typeof badgeDefinition>) {
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

// Create the complete collection once at module scope.
export const { Button, Badge, StylesProvider, useResolveComponentStyles } =
    createUI(
        {
            Button: {
                definition: buttonStyleDefinition,
                defaults: { variant: 'primary', size: 'small', theme: 'light' },
            },
            Badge: {
                definition: badgeDefinition,
                defaults: { tone: 'info' },
            },
        },
        { components: { Badge: createBadge } }
    );

export function Example() {
    return (
        <StylesProvider>
            <Button text="Continue" />
            <Badge tone="success">Saved</Badge>
        </StylesProvider>
    );
}
```

`Badge` accepts only `info` or `success` for `tone`. The collection hook resolves
`Badge` with `{ influencers: { tone: 'success' } }`, whereas `Button` still uses
its own variant/size/theme contract. A Card could instead define `layout` and
`density` influences and a `highlighted` state. Influence values must be strings,
numbers or symbols; boolean interaction flags belong in `states`.

Registration rules:

- Every configured custom name needs a builder; every supplied builder needs a
  matching configuration. Built-ins do not need a builder entry.
- Button is optional. For a custom-only collection, omit it from `config` and
  register the remaining builders in the second argument. Only configured
  components are returned; there are no implicitly included built-ins.
- Each definition determines its defaults; an invalid default cannot extend the
  allowed influence values. For a definition with no influences, use `defaults: {}`
  and call `useStyles({ influencers: {} })`.
- Use a `StyleDefinition` annotation, not only `satisfies`, so the type-only
  contract is retained. Sparse resolver maps remain supported: missing entries
  intentionally leave the base tokens unchanged. The factory cannot inspect
  erased TypeScript unions to validate their members at runtime.
- Prefer annotating a builder's argument with `UIComponentBuilderOptions<Definition>`
  as above, letting its returned component type be inferred. For an explicit
  whole-function annotation, use `UIComponentBuilder<Definition, Component>` with
  the concrete returned component type. Compound members and supported refs are
  preserved; the factory does not add them automatically.
- Builders own prop defaults, native prop forwarding, state tracking, accessibility,
  animation and rendering. Definitions alone do not generate that behavior.
- Builders cannot replace `Button` or use the reserved utility names
  `StylesProvider` and `useResolveComponentStyles`. Prototype-related names
  `__proto__`, `constructor` and `prototype`, and symbol component names are rejected.
- Invalid registrations throw before any builder is invoked. A builder must return
  a React component (function/class or a React wrapper such as `memo`/`forwardRef`),
  not an element or a native tag string.
- Registration is fixed at factory creation. Each call creates an independent
  provider; all its components use that provider, including when other factories
  are nested inside it.
- The provider's `styles` replacement must contain the complete configured
  collection with compatible contracts, including custom definitions. It changes
  styles, not builders, accepted props, or configured defaults.

## Button slots

The original text shorthand remains available, with an optional leading image:

```tsx
<Button text="Save" icon={saveImage} onPress={save} />
```

For composition, use `Button.Text` and `Button.Icon`. Both read resolved styles
from the nearest Button through a private context, including pressed/disabled
changes. They work through wrappers and fragments; using a part outside Button
throws. The root accepts shorthand `text`/`icon` together with explicit children.
Each explicit part overrides only its corresponding prop. Both props are optional,
so `icon` alone can also render an icon-only button.

```tsx
<Button onPress={save}>
	<Button.Icon source={saveImage} />
	<Button.Text>Save</Button.Text>
</Button>

<Button onPress={save} accessibilityLabel="Save">
	<Button.Icon source={saveImage} />
</Button>
```

With no overrides, shorthand order is icon then text. A single override replaces
its corresponding part in that order. When both parts are supplied as children,
their order of appearance wins. Every explicit part is retained, including multiple
instances of the same part; the corresponding fallback is omitted only once.

```tsx
// Custom icon, fallback text: icon then text.
<Button text="Save" icon={saveImage}>
	<Button.Icon source={customImage} />
</Button>

// Fallback icon, custom text: icon then text.
<Button text="Fallback label" icon={saveImage}>
	<Button.Text>Custom label</Button.Text>
</Button>

// Both overridden: explicit text then icon order is preserved.
<Button text="Fallback label" icon={saveImage}>
	<Button.Text>Custom label</Button.Text>
	<Button.Icon source={customImage} />
</Button>
```

Override detection recognizes direct parts, arrays, and fragments, not parts hidden
inside wrappers or custom components. Such nested parts still consume context but
do not suppress fallback props. Children are never cloned or reordered. Other
custom children retain their relative order; any fallback icon goes before all
children and any fallback text goes after them. An explicit empty part also
suppresses its fallback. A conditional `false`/`null` child does not.

Native text/image props are supported by the
built-in parts. Built-in images are decorative (`accessible={false}`) by default;
this can be overridden. Provide an accessible label for icon-only buttons.

Local part `style` is applied after the root's resolved slot styles and
`styleOverrides`. Existing icon spacing tokens are unchanged; configure spacing
through the style definition or a container slot override.

### Custom icon rendering

`Button.Icon` accepts an image `source`, ordinary children, or a render-function
child. Source and children are mutually exclusive. Plain children render unchanged,
without a wrapper or automatic styles. A render function receives the complete
resolved `tokens`, composed icon `style`, and effective `pressed`/`disabled` state:

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

Custom renderers explicitly map tokens/styles to their renderer's API and own
their accessibility and animation behavior. Image-only props such as `onLoad`
belong to source mode, not custom mode. To honor slot or local style overrides,
use the supplied `style` (mapping image properties such as `tintColor` as needed),
rather than relying only on tokens.

### Reusable slot contexts

`createSlotContext<Value>(componentName)` is a public utility. Call it once at
module scope per component family; it returns `{ Provider, useSlotContext }`.
Each invocation creates an isolated context, and the hook throws without its
matching provider. The optional hook argument names the consuming part in errors.

```tsx
import { createSlotContext } from 'rn-cuic';

type DisclosureContext = {
    expanded: boolean;
    toggle: () => void;
};

const { Provider, useSlotContext } =
    createSlotContext<DisclosureContext>('Disclosure');
```

The value shape is generic: add typed styles, tokens, state, actions, or any other
component-specific fields without changing the utility. It does not resolve
styles or manage state itself. Button's own provider and hook are private.

`hasSlot(children, Part)` is also exported for components that need per-part
fallbacks. It checks element identity through arrays/fragments without rendering
components or traversing their contents.

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
