import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import firebase from 'react-native-firebase';
import {
  Notification,
  NotificationOpen,
} from 'react-native-firebase/notifications';
import { useApolloClient } from '@apollo/react-hooks';
import { PushNotification } from 'components';
import {
  NavigationService,
  NotificationService,
} from 'services';
import {
  FETCH_CHATTING_FEED,
  FETCH_MESSAGE_FEED,
} from 'graphqls';

interface Props {
  pushNotificationRef: React.RefObject<PushNotification>;
}

const NotificationEvents: React.FunctionComponent<Props> = ({
  pushNotificationRef,
}) => {
  const [hasPermission, setHasPermission] = useState(NotificationService.hasPermission);

  const client = useApolloClient();

  const onNotification = useCallback((notification: Notification) => {
    try {
      const {
        screen,
        params,
      } = notification.data;
      const parsedParams = JSON.parse(params || '{}');

      switch (screen) {
        case 'Message':
          client.query({
            query: FETCH_CHATTING_FEED,
            fetchPolicy: 'network-only',
          }).catch(console.error);
          client.query({
            query: FETCH_MESSAGE_FEED,
            variables: {
              chattingId: parsedParams.chattingId,
            },
            fetchPolicy: 'network-only',
          }).catch(console.error);
          NotificationService.sync();
          if (pushNotificationRef.current) {
            pushNotificationRef.current.show({
              body: notification.body,
              ...parsedParams,
            });
          }
          break;
      }
    } catch (e) {
      console.error(e);
    }
  }, [client, pushNotificationRef]);

  const onNotificationOpen = useCallback((notificationOpen: NotificationOpen) => {
    try {
      const {
        screen,
        params,
      } = notificationOpen.notification.data;

      onNotification(notificationOpen.notification);
      NavigationService.navigate(screen, JSON.parse(params || '{}'));
      NotificationService.clearBadge();
    } catch (e) {
      console.error(e);
    }
  }, [onNotification]);

  useEffect(() => {
    NotificationService.checkPermission().then((enabled) => {
      if (enabled) {
        setHasPermission(true);
        NotificationService.refreshToken();
      } else {
        NotificationService.requestPermission();
      }
    });
  }, [setHasPermission]);

  useEffect(() => {
    if (!hasPermission) {
      return;
    }

    const disposer = firebase.notifications().onNotification(onNotification);

    return () => disposer();
  }, [hasPermission, onNotification]);

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
