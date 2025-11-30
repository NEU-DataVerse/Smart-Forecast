import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAppStore } from '@/store/appStore';

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      throw new Error('Failed to get push token for push notification!');
    }
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error('EAS Project ID is not defined in app configuration.');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        })
      ).data;
      console.log('Push notification token:', pushTokenString);

      // Setup notification listener to add alerts to store
      setupNotificationListeners();

      return pushTokenString;
    } catch (error) {
      throw new Error('Error fetching push token: ' + error);
    }
  } else {
    throw new Error('Must use physical device for Push Notifications');
  }
}

/**
 * Setup listeners to handle incoming notifications and add them to app store
 */
function setupNotificationListeners() {
  // Listen for notifications received while app is in foreground
  Notifications.addNotificationReceivedListener((notification) => {
    console.log('📬 Notification received:', notification);
    handleNotificationAndAddToStore(notification);
  });

  // Listen for notification responses (when user taps the notification)
  Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('👆 User tapped notification:', response);
    handleNotificationAndAddToStore(response.notification);
  });
}

/**
 * Handle incoming notification and add to alerts store
 */
function handleNotificationAndAddToStore(notification: Notifications.Notification) {
  const { content } = notification.request;
  const { addAlert } = useAppStore.getState();

  const alertType = (content.data?.type as string) || 'alert';
  const severity = (content.data?.severity as string) || 'medium';
  const location = (content.data?.location as string) || 'Unknown Location';

  const newAlert = {
    id: notification.request.identifier,
    type: alertType,
    title: content.title || 'New Alert',
    message: content.body || '',
    severity: severity as 'low' | 'medium' | 'high' | 'critical',
    timestamp: Date.now(),
    location: location,
    read: false,
  };

  console.log('Adding alert to store:', newAlert);
  addAlert(newAlert);
}
