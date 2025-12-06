import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Smart Forecast App',
  slug: 'smart-forecast',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/logo-smartforecast.png',
  scheme: 'smart-forecast-app',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/logo-smartforecast.png',
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
      foregroundImage: './assets/images/logo-smartforecast.png',
      backgroundColor: '#ffffff',
    },
    package: 'app.smartforecast',
    permissions: [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
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
  },
  web: {
    favicon: './assets/images/logo-smartforecast.png',
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-web-browser',
    '@react-native-google-signin/google-signin',
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
      projectId: '969918ff-0991-4f7c-8b36-2dcac7babc47',
    },
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_MINIO_URL: process.env.EXPO_PUBLIC_MINIO_URL,
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  },
  owner: 'nguyenthanhdatndc',
});
