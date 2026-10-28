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
associated by TypeScript. For another collection, call
`createStylesManager({ Button: buttonDefinition, TextInput: inputDefinition })`
once at module scope. It returns its own `StylesProvider` and
`useResolveComponentStyles`; use the matching pair. Annotate each definition
with `StyleDefinition<Influences, Tokens, States, SlotStyles>` so optional
resolvers still retain the complete component contract. Use a type annotation,
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
