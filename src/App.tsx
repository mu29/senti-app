import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { StatusBar } from 'react-native';
import codePush from 'react-native-code-push';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import firebase, { RNFirebase } from 'react-native-firebase';
import Sound from 'react-native-sound';
import SplashScreen from 'react-native-splash-screen';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import 'dayjs/locale/ko';

import { PushNotification } from 'components';
import {
  AuthModal,
  NotificationEvents,
} from 'containers';
import { FETCH_PROFILE } from 'graphqls';
import { NavigationService } from 'services';
import { LANGUAGE } from 'constants/config';

import Navigator from './Navigator';
import configureClient from './apollo';

// @ts-ignore
Sound.enableInSilenceMode(true);
Sound.setActive(true);

dayjs.locale(LANGUAGE);
dayjs.extend(relativeTime);

const App: React.FunctionComponent<{}> = () => {
  const pushNotificationRef = useRef(null);

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  const [user, setUser] = useState<RNFirebase.User | null>(null);

  const setNavigationRef = useCallback((ref: any) => {
    NavigationService.setTopLevelNavigator(ref);
  }, []);

  useEffect(() => {
    configureClient().then(setClient);
  }, [setClient]);

  useEffect(() => {
    const authStateUnsubscriber = firebase.auth().onAuthStateChanged(setUser);
    return () => authStateUnsubscriber();
  }, [setUser]);

  useEffect(() => {
    if (client) {
      client.query({
        query: FETCH_PROFILE,
        fetchPolicy: 'network-only',
      })
      .catch(console.error)
      .finally(() => SplashScreen.hide());
    }
  }, [client, user]);

  if (!client) {
    return null;
  }

  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ApolloProvider client={client}>
        <React.Fragment>
          <AuthModal />
          <Navigator ref={setNavigationRef} />
          <NotificationEvents user={user} pushNotificationRef={pushNotificationRef} />
          <PushNotification ref={pushNotificationRef} />
        </React.Fragment>
      </ApolloProvider>
    </React.Fragment>
  );
};

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_SUSPEND,
  minimumBackgroundDuration: 60 * 5,
})(App);
