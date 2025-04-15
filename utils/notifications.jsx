// utils/notifications.ts

import * as Notifications from 'expo-notifications';

// Configure foreground behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Schedules a daily notification at a given hour/minute
export async function scheduleDailyNotification(hour, minute) {
  await Notifications.cancelAllScheduledNotificationsAsync(); // clear old ones (optional)

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Daily Reminder',
      body: "please Dont forget to add food delatis!",

      sound: 'default',
    },
    trigger: {
        trigger: { hour:hour,minute:minute, repeats: true, }, // For testing, set to 5 seconds. Change to 24 * 60 * 60 for daily.
    },
  });
}
