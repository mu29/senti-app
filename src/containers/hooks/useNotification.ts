import {
  useState,
  useCallback,
  useEffect,
} from 'react';
import firebase from 'react-native-firebase';
import { Notification } from 'react-native-firebase/notifications';

function useNotification(onNotification: (notification: Notification) => void) {
  const [hasPermission, setHasPermission] = useState(false);

  const checkPermission = useCallback(async () => {
    const enabled = await firebase.messaging().hasPermission();
    setHasPermission(enabled);
  }, [setHasPermission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    if (!hasPermission) {
      return;
    }

    const disposer = firebase.notifications().onNotification(onNotification);

    return () => disposer();
  }, [hasPermission, onNotification]);
}

export default useNotification;
