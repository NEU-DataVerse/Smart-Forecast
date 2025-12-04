import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Register for Expo Push Notifications
 * - Sets up Android notification channel
 * - Requests permission
 * - Gets Expo Push Token
 *
 * Note: Notification listeners are handled in NotificationContext.tsx
 * to avoid duplicate handling
 */
export async function registerForPushNotificationsAsync(): Promise<string> {
  // Setup Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Check if running on physical device
  if (!Device.isDevice) {
    throw new Error('Must use physical device for Push Notifications');
  }

  // Request permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    throw new Error('Failed to get push token for push notification!');
  }

  // Get EAS Project ID
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  if (!projectId) {
    throw new Error('EAS Project ID is not defined in app configuration.');
  }

  // Get Expo Push Token
  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      })
    ).data;

    console.log('📱 Expo Push Token:', pushTokenString);
    return pushTokenString;
  } catch (error) {
    throw new Error('Error fetching push token: ' + error);
  }
}
