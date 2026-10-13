const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');
const { withStorybook } = require('@storybook/react-native/withStorybook');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
  conditions: ['rn-cuic-source'],
});

module.exports = withStorybook(config, {
  configPath: path.resolve(root, '.rnstorybook'),
  liteMode: true,
});
