import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/utils/registerForPushNotificationsAsync';
import { useAuth } from './AuthContext';
import { userApi } from '@/services/api';

type NotificationSubscription =
  | ReturnType<typeof Notifications.addNotificationReceivedListener>
  | ReturnType<typeof Notifications.addNotificationResponseReceivedListener>;

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [fcmTokenSent, setFcmTokenSent] = useState(false);

  const { token: authToken, isAuthenticated } = useAuth();

  const notificationListener = useRef<NotificationSubscription | null>(null);
  const responseListener = useRef<NotificationSubscription | null>(null);

  // Register for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then(
      async (token) => {
        setExpoPushToken(token);

        // Send token to backend for push notifications
        if (token) {
          try {
            await userApi.updatePushToken(token);
            console.log('📱 Push token synced with backend');
          } catch (err) {
            console.warn('Failed to sync push token with backend:', err);
          }
        }
      },
      (error) => setError(error),
    );

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('🔔 Notification Received: ', notification);
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(
        '🔔 Notification Response: ',
        JSON.stringify(response, null, 2),
        JSON.stringify(response.notification.request.content.data, null, 2),
      );
      // Handle the notification response here
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  // Send FCM token to backend when user is authenticated and token is available
  useEffect(() => {
    const sendFcmTokenToBackend = async () => {
      if (expoPushToken && authToken && isAuthenticated && !fcmTokenSent) {
        try {
          console.log('📤 Sending FCM token to backend:', expoPushToken);
          await userApi.updateFcmToken(expoPushToken, authToken);
          setFcmTokenSent(true);
          console.log('✅ FCM token sent to backend successfully');
        } catch (error) {
          console.error('❌ Failed to send FCM token to backend:', error);
          // Don't set fcmTokenSent to allow retry on next render
        }
      }
    };

    sendFcmTokenToBackend();
  }, [expoPushToken, authToken, isAuthenticated, fcmTokenSent]);

  // Reset fcmTokenSent when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setFcmTokenSent(false);
    }
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
      {children}
    </NotificationContext.Provider>
  );
};
