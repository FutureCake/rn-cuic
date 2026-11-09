const resolveNative = require('@react-native/jest-preset/jest/resolver');
const resolveWorklets = require('react-native-worklets/jest/resolver');

// Worklets' JS test runtime must not load its native JSI implementation.
module.exports = (request, options) =>
    resolveWorklets(request, {
        ...options,
        defaultResolver: (path, settings) =>
            resolveNative(path, {
                ...settings,
                defaultResolver: options.defaultResolver,
            }),
    });
