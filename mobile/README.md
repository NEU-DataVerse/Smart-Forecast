# Smart-Forecast Mobile App

React Native mobile application built with Expo for the Smart-Forecast environmental monitoring system.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development](#development)
- [Building](#building)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- Real-time environmental monitoring
- Interactive map interface with alerts
- Weather data integration
- Push notifications
- User authentication
- Offline support with async storage
- Cross-platform support (iOS, Android, Web)

## 📦 Prerequisites

- Node.js 18+ or npm/pnpm
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Android Studio (for Android development)
- Xcode (for iOS development on macOS)

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

Or with pnpm:

```bash
pnpm install
```

### 2. Start the development server

```bash
npm start
# or
npx expo start
```

### 3. Run on your device/emulator

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Web**: Press `w` in the terminal
- **Physical Device**: Scan QR code with Expo Go app

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start development server
npm run android    # Start on Android emulator
npm run ios        # Start on iOS simulator
npm run web        # Start web version
npm run lint       # Run ESLint
npm run reset-project  # Reset project to initial state
```

## 🏗️ Building

### EAS Build Configuration

1. **Install EAS CLI globally** (if not already installed):

```bash
npm install -g eas-cli
```

2. **Check EAS CLI version**:

```bash
eas -v
```

3. **Initialize EAS project**:

```bash
eas init
```

4. **Configure builds**:

```bash
eas build:configure
```

5. **Build for development**:

```bash
eas build --profile development
```

### Build Profiles

- **development**: Development build with dev client
- **preview**: Pre-release testing
- **production**: Production release build

## 📁 Project Structure

```
mobile/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tabbed navigation screens
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screen
├── components/            # Reusable components
│   ├── AlertCard.tsx
│   ├── EnvCard.tsx
│   └── ...
├── services/             # API and business logic
├── store/                # State management
├── types/                # TypeScript types
├── constants/            # App constants
├── hooks/                # Custom React hooks
├── assets/               # Images and static files
└── scripts/              # Build and setup scripts
```

## ⚙️ Configuration

### Firebase Setup

Firebase configuration is handled via `google-services.json` (included in the project).

### Environment Variables

Configure environment-specific settings in `app.config.ts`:

```typescript
export default {
  name: 'Smart-Forecast',
  slug: 'smart-forecast',
  version: '1.0.0',
  // ... other config
};
```

### Location Permissions

The app requires location permissions for:

- Map display
- Weather data for current location
- Alert notifications based on location

## 🔧 Troubleshooting

### Build Issues

- **Clear cache**: `expo start --clear` or `npx expo start -c`
- **Reinstall dependencies**: `rm -rf node_modules && npm install`
- **Update Expo**: `npm install -g expo-cli@latest`

### Runtime Issues

- **Port already in use**: Change port with `expo start --port 8081`
- **Metro bundler errors**: Clear Metro cache `watchman watch-del-all`
- **Location permissions**: Grant permissions in app settings

### Common Solutions

- Check internet connection
- Verify backend API is running and accessible
- Check Firebase configuration
- Review device logs: `adb logcat` (Android) or Xcode console (iOS)

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Smart-Forecast Main README](../README.md)

## 📄 License

This project is part of the Smart-Forecast system. See the main [LICENSE](../LICENSE) file for details.
