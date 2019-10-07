import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import firebase, { RNFirebase } from 'react-native-firebase';
import { NotificationOpen } from 'react-native-firebase/notifications';
import { useMutation } from '@apollo/react-hooks';
import { NavigationService } from 'services';
import { CREATE_FCM_TOKEN } from 'graphqls';

interface Props {
  user: RNFirebase.User | null;
}

const NotificationEvents: React.FunctionComponent<Props> = ({
  user,
}) => {
  const [hasPermission, setHasPermission] = useState(false);

  const [createFcmToken] = useMutation(CREATE_FCM_TOKEN);

  const checkPermission = useCallback(async () => {
    const enabled = await firebase.messaging().hasPermission();
    setHasPermission(enabled);
    return enabled;
  }, [setHasPermission]);

  const requestPermission = useCallback(() => {
    firebase.messaging().requestPermission()
      .then(() => checkPermission())
      .catch(() => {});
  }, [checkPermission]);

  const refreshToken = useCallback(async () => {
    const fcmToken = await firebase.messaging().getToken();

    if (fcmToken) {
      createFcmToken({
        variables: { fcmToken },
      });
    }

    firebase.messaging().subscribeToTopic('broadcast');
  }, [createFcmToken]);

  const onNotificationOpen = useCallback((notificationOpen: NotificationOpen) => {
    const {
      screen,
      params,
    } = notificationOpen.notification.data;

    try {
      NavigationService.navigate(screen, JSON.parse(params || '{}'));
    } catch {}
  }, []);

  useEffect(() => {
    checkPermission().then((enabled) => {
      if (enabled) {
        refreshToken();
      } else {
        requestPermission();
      }
    });
  }, [user, checkPermission, refreshToken, requestPermission]);

  useEffect(() => {
    if (!hasPermission) {
      return;
    }

    const disposer = firebase.notifications().onNotificationOpened(onNotificationOpen);
    firebase.notifications().getInitialNotification().then((notificationOpen) => {
      if (notificationOpen) {
        onNotificationOpen(notificationOpen);
      }
    });

    return () => disposer();
  }, [hasPermission, onNotificationOpen]);

  return null;
};

export default NotificationEvents;
