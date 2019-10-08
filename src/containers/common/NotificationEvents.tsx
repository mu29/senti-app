import React, {
  useCallback,
  useEffect,
} from 'react';
import firebase, { RNFirebase } from 'react-native-firebase';
import {
  Notification,
  NotificationOpen,
} from 'react-native-firebase/notifications';
import { useApolloClient } from '@apollo/react-hooks';
import { useNotification } from 'containers';
import { NavigationService } from 'services';
import {
  FETCH_CHATTING_FEED,
  FETCH_MESSAGE_FEED,
} from 'graphqls';

interface Props {
  user: RNFirebase.User | null;
}

const NotificationEvents: React.FunctionComponent<Props> = ({
  user,
}) => {
  const client = useApolloClient();

  const hasPermission = useNotification(user);

  const onNotificationOpen = useCallback((notificationOpen: NotificationOpen) => {
    try {
      const {
        screen,
        params,
      } = notificationOpen.notification.data;
      NavigationService.navigate(screen, JSON.parse(params || '{}'));
    } catch (e) {
      console.error(e);
    }
  }, []);

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
        });
        client.query({
          query: FETCH_MESSAGE_FEED,
          variables: {
            chattingId: parsedParams.chattingId,
          },
          fetchPolicy: 'network-only',
        });
        break;
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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

  useEffect(() => {
    if (!hasPermission) {
      return;
    }

    const disposer = firebase.notifications().onNotification(onNotification);

    return () => disposer();
  }, [hasPermission, onNotification]);

  return null;
};

export default NotificationEvents;
