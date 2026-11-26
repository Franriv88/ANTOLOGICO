const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

const rootModules = path.resolve(monorepoRoot, 'node_modules');

const singletons = {
  react: path.resolve(rootModules, 'react/index.js'),
  'react/jsx-runtime': path.resolve(rootModules, 'react/jsx-runtime.js'),
  'react/jsx-dev-runtime': path.resolve(rootModules, 'react/jsx-dev-runtime.js'),
  'react-native': path.resolve(rootModules, 'react-native/index.js'),
};

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (singletons[moduleName]) {
    return { filePath: singletons[moduleName], type: 'sourceFile' };
  }

  const resolver = originalResolveRequest || context.resolveRequest;
  return resolver(context, moduleName, platform);
};

module.exports = config;
