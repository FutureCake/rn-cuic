import { LiteUI } from '@storybook/react-native-ui-lite';
import { registerRootComponent } from 'expo';

import { view } from './storybook.requires';

/**
 * This file is user-editable.
 *
 * Use it as your React Native Storybook entrypoint and wrap `StorybookUIRoot`
 * with application decorators/providers (theme, i18n, state, navigation, etc).
 */
const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: false,
  CustomUIComponent: LiteUI,
});

registerRootComponent(StorybookUIRoot);

export default StorybookUIRoot;
