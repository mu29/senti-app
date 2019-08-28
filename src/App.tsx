import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import { StatusBar } from 'react-native';
import { ApolloProvider } from '@apollo/react-hooks';
import firebase from 'react-native-firebase';
import Sound from 'react-native-sound';
import { Provider } from 'mobx-react/native';
import moment from 'moment';
import 'moment/locale/ko';
import { AuthModal } from 'containers';
import * as states from './stores/states';
import {
  FETCH_PROFILE,
  FETCH_COVERS,
} from './graphqls';
import Navigator from './Navigator';
import NavigationService from './NavigationService';
import client from './apollo';

// @ts-ignore
Sound.enableInSilenceMode(true);
Sound.setActive(true);

moment.locale('ko');

const App: React.FunctionComponent<{}> = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const setNavigationRef = useCallback((ref: any) => {
    NavigationService.setTopLevelNavigator(ref);
  }, []);

  useEffect(() => {
    const authStateUnsubscriber = firebase.auth().onAuthStateChanged(() => {
      client.query({
        query: FETCH_PROFILE,
        fetchPolicy: 'network-only',
      })
      .finally(() => setIsLoaded(true));
    });
    setTimeout(() => setIsLoaded(true), 1000);
    client.query({ query: FETCH_COVERS });

    return authStateUnsubscriber;
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Provider {...states}>
        <ApolloProvider client={client}>
          <React.Fragment>
            <AuthModal />
            <Navigator ref={setNavigationRef} />
          </React.Fragment>
        </ApolloProvider>
      </Provider>
    </React.Fragment>
  );
};

export default App;
