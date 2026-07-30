const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');
const projectRoot = '/home/rhiper/Desktop/Bolar/zero-waste-platform';
const config = getDefaultConfig(projectRoot);
console.log('Platforms:', config.resolver.platforms);
console.log('extraNodeModules:', config.resolver.extraNodeModules);
