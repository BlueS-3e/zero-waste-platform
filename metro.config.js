const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const { resolve } = require('metro-resolver');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // If we are building for web, redirect all react-native and react-native-maps imports
  if (platform === 'web' || context.originModulePath.includes('node_modules/expo-router/node')) {
    if (moduleName === 'react-native') {
      return resolve(context, 'react-native-web', platform);
    }
    if (moduleName.startsWith('react-native/')) {
      return resolve(context, moduleName.replace('react-native', 'react-native-web'), platform);
    }
    if (moduleName === 'react-native-maps' || moduleName.startsWith('react-native-maps/')) {
      return resolve(context, path.resolve(__dirname, 'src/web/react-native-maps'), platform);
    }
  }

  // Normal resolution
  return resolve(context, moduleName, platform);
};

config.resolver.platforms = ['web', 'ios', 'android'];

config.watchFolders = [
  ...(config.watchFolders || []),
  path.resolve(__dirname, 'src/web'),
];

module.exports = config;
