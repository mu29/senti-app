import React from 'react';
import { StatusBar } from 'react-native';
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

import { AuthModal } from 'containers';
import { FETCH_PROFILE } from 'graphqls';
import { getLanguage } from 'utils';

import Navigator from './Navigator';
import NavigationService from './NavigationService';
import configureClient from './apollo';

// @ts-ignore
Sound.enableInSilenceMode(true);
Sound.setActive(true);

dayjs.locale(getLanguage());
dayjs.extend(relativeTime);

interface State {
  user: RNFirebase.User | null;
  client?: ApolloClient<NormalizedCacheObject>;
}

class App extends React.PureComponent<{}, State> {
  public state: State = {
    user: null,
    client: undefined,
  };

  private isReady = false;

  private authStateUnsubscriber?: () => void;

  constructor(props: {}) {
    super(props);
    this.authStateUnsubscriber = firebase.auth().onAuthStateChanged((user) => {
      if (this.isReady) {
        this.setState({ user });
      } else {
        this.state = Object.assign(this.state, { user });
      }
    });
  }

  public async componentDidMount() {
    this.isReady = true;
    this.setState({ client: await configureClient() });
  }

  public componentDidUpdate() {
    const { client } = this.state;
    if (client) {
      client.query({
        query: FETCH_PROFILE,
        fetchPolicy: 'network-only',
      })
      .finally(() => SplashScreen.hide());
    }
  }

  public componentWillUnmount() {
    if (this.authStateUnsubscriber) {
      this.authStateUnsubscriber();
    }
  }

  public render() {
    const { client } = this.state;

    if (!client) {
      return null;
    }

    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ApolloProvider client={client}>
          <React.Fragment>
            <AuthModal />
            <Navigator ref={this.setNavigationRef} />
          </React.Fragment>
        </ApolloProvider>
      </React.Fragment>
    );
  }

  private setNavigationRef = (ref: any) => {
    NavigationService.setTopLevelNavigator(ref);
  }
}

export default App;
