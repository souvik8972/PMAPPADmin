// hooks/useNotificationPermission.ts

import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export const useNotificationPermission = () => {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          alert('Enable notifications from settings to receive reminders!');
        }
      }
    })();
  }, []);
};
