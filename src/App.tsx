import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  StatusBar,
  LayoutChangeEvent,
} from 'react-native';
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
  DynamicLinkEvents,
  NotificationEvents,
  useAppState,
} from 'containers';
import { FETCH_PROFILE } from 'graphqls';
import {
  NavigationService,
  NotificationService,
  AnalyticsService,
  LayoutService,
} from 'services';
import { LANGUAGE } from 'constants/config';

import Navigator from './Navigator';
import configureClient from './apollo';

// @ts-ignore
Sound.enableInSilenceMode(true);
Sound.setActive(true);

dayjs.locale(LANGUAGE);
dayjs.extend(relativeTime);

/* eslint-disable no-undef */
if (typeof ErrorUtils !== 'undefined') {
  const defaultHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error) => {
    AnalyticsService.logError(error);
    defaultHandler.apply(defaultHandler, error);
  });
}
/* eslint-enable no-undef */

const App: React.FunctionComponent<{}> = () => {
  const pushNotificationRef = useRef(null);

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  const [user, setUser] = useState<RNFirebase.User | null>(null);

  const [height, setHeight] = useState(0);

  const setNavigationRef = useCallback((ref: any) => {
    NavigationService.setTopLevelNavigator(ref);
  }, []);

  const setScreenHeight = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    const {
      width,
      height,
    } = nativeEvent.layout
    setHeight(height);
    LayoutService.setViewport(width, height);
  }, [setHeight]);

  useEffect(() => {
    configureClient().then(setClient);
  }, [setClient]);

  useEffect(() => {
    const authStateUnsubscriber = firebase.auth().onAuthStateChanged(setUser);
    return () => authStateUnsubscriber();
  }, [setUser]);

  useEffect(() => {
    if (client) {
      client.query<{ profile: Profile }>({
        query: FETCH_PROFILE,
        fetchPolicy: 'network-only',
      })
      .then(({ data }) => {
        if (data && data.profile) {
          NotificationService.setUser(data.profile);
        }
      })
      .catch(console.error)
      .finally(() => SplashScreen.hide());
      NotificationService.setClient(client);
      NotificationService.sync();
    }
  }, [client, user]);

  useAppState(() => {
    NotificationService.sync();
  });

  if (!client || height === 0) {
    return <View style={{ flex: 1 }} onLayout={setScreenHeight} />;
  }

  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ApolloProvider client={client}>
        <React.Fragment>
          <Navigator ref={setNavigationRef} />
          <PushNotification ref={pushNotificationRef} />
          <NotificationEvents pushNotificationRef={pushNotificationRef} />
          <DynamicLinkEvents />
          <AuthModal />
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
