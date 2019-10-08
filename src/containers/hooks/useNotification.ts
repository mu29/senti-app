import {
  useState,
  useCallback,
  useEffect,
} from 'react';
import firebase, { RNFirebase } from 'react-native-firebase';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_FCM_TOKEN } from 'graphqls';

function useNotification(user: RNFirebase.User | null) {
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
      .catch(console.error);
  }, [checkPermission]);

  const refreshToken = useCallback(async () => {
    const fcmToken = await firebase.messaging().getToken();

    if (fcmToken && user) {
      createFcmToken({
        variables: { fcmToken },
      });
    }

    firebase.messaging().subscribeToTopic('broadcast');
  }, [user, createFcmToken]);

  useEffect(() => {
    checkPermission().then((enabled) => {
      if (enabled) {
        refreshToken();
      } else {
        requestPermission();
      }
    });
  }, [user, checkPermission, refreshToken, requestPermission]);

  return hasPermission;
}

export default useNotification;
