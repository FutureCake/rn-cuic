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
const styles = useResolveComponentStyles('Button', {
	influencers: { variant: 'rounded', size: 'medium', theme: 'dark' },
	states: { pressed: true, disabled: false },
});
// styles.container is ViewStyle + Reanimated transition settings.
// styles.text is TextStyle + Reanimated transition settings.
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
owns its pressed/disabled behavior and applies both slot styles to animated
elements.

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
