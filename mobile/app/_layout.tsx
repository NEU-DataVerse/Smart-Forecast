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
import { NotificationProvider } from '@/context/NotificationContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import * as Notifications from 'expo-notifications';

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

  React.useEffect(() => {
    const handleNavigation = async () => {
      if (!isLoading) {
        // Hide splash screen once on first load
        if (!splashHidden) {
          try {
            await SplashScreen.hideAsync();
          } catch (e) {
            console.error('Error hiding splash screen:', e);
          }
          setSplashHidden(true);
        }

        // Navigate based on auth state
        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      }
    };

    handleNavigation();
  }, [isLoading, isAuthenticated, router, splashHidden]);

  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
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
            </NotificationProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  );
}
