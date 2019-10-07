import { useEffect } from 'react';
import firebase from 'react-native-firebase';
import {
  Notification,
  NotificationOpen,
} from 'react-native-firebase/notifications';
import { NotificationService } from 'services';

function useNotification(
  onNotification: (notification: Notification) => void,
  onNotificationOpened: (notificationOpen: NotificationOpen) => void,
) {
  useEffect(() => {
    let removeNotificationListener: Function | undefined;
    let removeNotificationOpenListener: Function | undefined;

    if (NotificationService.hasPermission) {
      removeNotificationListener = firebase.notifications().onNotification(onNotification);
      removeNotificationOpenListener = firebase.notifications().onNotificationOpened(onNotificationOpened);

      firebase.notifications().getInitialNotification().then((notificationOpen) => {
        if (notificationOpen) {
          onNotificationOpened(notificationOpen);
        }
      });
    }

    return () => {
      removeNotificationListener && removeNotificationListener();
      removeNotificationOpenListener && removeNotificationOpenListener();
    };
  }, [onNotification, onNotificationOpened]);
}

export default useNotification;
