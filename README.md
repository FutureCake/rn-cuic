# rn-cuic

customizable ui components for react native

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

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
