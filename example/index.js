import { registerRootComponent } from 'expo';

// EXPO_PUBLIC_* vars are inlined at bundle time, so this branch is static.
// Metro strips the storybook modules when the flag is off (see metro.config.js).
if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
    // .rnstorybook/index.ts registers its own root component.
    require('../.rnstorybook');
} else {
    const App = require('./src/App').default;

    // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
    // It also ensures that whether you load the app in Expo Go or in a native build,
    // the environment is set up appropriately
    registerRootComponent(App);
}
