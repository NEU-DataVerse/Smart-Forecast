const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Set EXPO_ROUTER_APP_ROOT for expo-router
process.env.EXPO_ROUTER_APP_ROOT = 'app';

module.exports = config;
