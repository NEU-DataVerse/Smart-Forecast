const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');
const sharedPackage = path.resolve(monorepoRoot, 'shared');

const config = getDefaultConfig(projectRoot);

// Set EXPO_ROUTER_APP_ROOT for expo-router
process.env.EXPO_ROUTER_APP_ROOT = 'app';

// Only watch the shared package in addition to the project
config.watchFolders = [sharedPackage];

// Let Metro know where to resolve packages from
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Disable hierarchical lookup to prevent issues with pnpm
config.resolver.disableHierarchicalLookup = true;

// Force resolving shared package from the monorepo
config.resolver.extraNodeModules = {
  '@smart-forecast/shared': sharedPackage,
};

module.exports = config;
