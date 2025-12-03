import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
      staleTime: 5 * 60 * 1000,
    },
  },
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
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
