import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Smart Forecast App',
  slug: 'smart-forecast',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'smart-forecast-app',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'app.smart-forecast-app',
    infoPlist: {
      NSLocationAlwaysAndWhenInUseUsageDescription: 'Allow $(PRODUCT_NAME) to use your location.',
      NSLocationAlwaysUsageDescription: 'Allow $(PRODUCT_NAME) to use your location.',
      NSLocationWhenInUseUsageDescription: 'Allow $(PRODUCT_NAME) to use your location.',
      UIBackgroundModes: ['location'],
      NSPhotoLibraryUsageDescription: 'Allow $(PRODUCT_NAME) to access your photos',
      NSCameraUsageDescription: 'Allow $(PRODUCT_NAME) to access your camera',
      NSMicrophoneUsageDescription: 'Allow $(PRODUCT_NAME) to access your microphone',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/android-icon-background.png',
      backgroundColor: '#ffffff',
    },
    package: 'app.smartforecastapp',
    permissions: [
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.FOREGROUND_SERVICE_LOCATION',
      'android.permission.ACCESS_BACKGROUND_LOCATION',
      'android.permission.CAMERA',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.RECORD_AUDIO',
    ],
    googleServicesFile: './google-services.json',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-web-browser',
    [
      'expo-location',
      {
        isAndroidForegroundServiceEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
        isIosBackgroundLocationEnabled: true,
        locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'The app accesses your photos to let you share them with your friends.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: '5d231caf-e8ca-4ed0-9407-f7484b998f80',
    },
  },
  owner: 'nguyenthanhdatvn2005',
});
