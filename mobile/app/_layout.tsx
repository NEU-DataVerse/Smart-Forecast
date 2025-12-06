import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { NotificationProvider } from '@/context/NotificationContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import * as Notifications from 'expo-notifications';

const ONBOARDING_KEY = 'hasSeenOnboarding';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 15 * 60 * 1000, // 15 minutes - data considered fresh
      gcTime: 24 * 60 * 60 * 1000, // 24 hours - cache retention for offline
    },
  },
});

// AsyncStorage persister for offline caching
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'smart-forecast-cache',
});

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [splashHidden, setSplashHidden] = React.useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = React.useState<boolean | null>(null);

  // Check onboarding status
  React.useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasSeenOnboarding(seen === 'true');
      } catch {
        setHasSeenOnboarding(true); // Default to true on error
      }
    };
    checkOnboarding();
  }, []);

  React.useEffect(() => {
    const handleNavigation = async () => {
      try {
        // Wait for both auth and onboarding check
        if (!isLoading && hasSeenOnboarding !== null) {
          // Hide splash screen once on first load
          if (!splashHidden) {
            try {
              await SplashScreen.hideAsync();
            } catch (e) {
              console.error('Error hiding splash screen:', e);
            }
            setSplashHidden(true);
          }

          // Navigate based on onboarding and auth state
          if (!hasSeenOnboarding) {
            router.replace('/onboarding');
          } else if (isAuthenticated) {
            router.replace('/(tabs)');
          } else {
            router.replace('/login');
          }
        }
      } catch (error) {
        console.error('❌ Error during navigation:', error);
        // Fallback: hide splash and go to login
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.error('Error hiding splash screen in fallback:', e);
        }
        setSplashHidden(true);
        router.replace('/login');
      }
    };

    handleNavigation();
  }, [isLoading, isAuthenticated, hasSeenOnboarding, router, splashHidden]);

  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  // Global error handler
  React.useEffect(() => {
    const errorHandler = (error: Error) => {
      console.error('🚨 Global Error:', error);
      // Prevent app crash by catching unhandled errors
    };

    // Note: In production, you might want to use a crash reporting service like Sentry
    if (typeof ErrorUtils !== 'undefined') {
      ErrorUtils.setGlobalHandler(errorHandler);
    }
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <AuthProvider>
            <NotificationProvider>
              <RootLayoutNav />
              <Toast />
            </NotificationProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  );
}
