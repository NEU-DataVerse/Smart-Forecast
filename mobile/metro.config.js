const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');
const sharedPackage = path.resolve(monorepoRoot, 'shared');

const config = getDefaultConfig(projectRoot);

// Set EXPO_ROUTER_APP_ROOT for expo-router
process.env.EXPO_ROUTER_APP_ROOT = 'app';

// Watch folders for the monorepo
config.watchFolders = [monorepoRoot];

// Let Metro know where to resolve packages from
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Enable symlink support for pnpm
config.resolver.unstable_enableSymlinks = true;

// Extra node modules for monorepo shared package
config.resolver.extraNodeModules = {
  '@smart-forecast/shared': sharedPackage,
};

module.exports = config;
