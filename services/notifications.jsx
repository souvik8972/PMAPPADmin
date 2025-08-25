import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { savePushTokenToBackend } from './api';
import { Toast } from "toastify-react-native";
 
let notificationListener;
let responseListener;
 
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    Toast.error('Must use physical device for push notifications');
    return;
  }
 
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
 
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
 
  if (finalStatus !== 'granted') {
    Toast.error('Permission not granted!');
    return;
  }
 
  const tokenData = await Notifications.getExpoPushTokenAsync();
//   await savePushTokenToBackend('userId', tokenData.data); // Replace 'userId' with actual user ID
  console.log('Push token:', tokenData.data);
 
  return tokenData.data; // ExponentPushToken[...]
}
 
export function initNotificationListeners(onReceive, onResponse) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
 
  notificationListener = Notifications.addNotificationReceivedListener(onReceive);
 
  responseListener = Notifications.addNotificationResponseReceivedListener(onResponse);
}
 
export function removeNotificationListeners() {
  if (notificationListener) Notifications.removeNotificationSubscription(notificationListener);
  if (responseListener) Notifications.removeNotificationSubscription(responseListener);
}