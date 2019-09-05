import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
} from 'react-native';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import firebase, { RNFirebase } from 'react-native-firebase';
import Sound from 'react-native-sound';
import moment from 'moment';
import 'moment/locale/ko';

import { AuthModal } from 'containers';
import { FETCH_PROFILE } from 'graphqls';
import { palette } from 'constants/style';

import Navigator from './Navigator';
import NavigationService from './NavigationService';
import configureClient from './apollo';

// @ts-ignore
Sound.enableInSilenceMode(true);
Sound.setActive(true);

moment.locale('ko');

interface State {
  user: RNFirebase.User | null;
  client?: ApolloClient<NormalizedCacheObject>;
  hasCacheLoaded: boolean;
  hasAuthTriggered: boolean;
}

class App extends React.PureComponent<{}, State> {
  public state: State = {
    user: null,
    client: undefined,
    hasCacheLoaded: false,
    hasAuthTriggered: false,
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
    this.setState({
      client: await configureClient(),
      hasCacheLoaded: true,
    });
  }

  public componentDidUpdate() {
    const { client } = this.state;
    if (client) {
      client.query({
        query: FETCH_PROFILE,
        fetchPolicy: 'network-only',
      })
      .finally(() => this.setState({ hasAuthTriggered: true }));
    }
  }

  public componentWillUnmount() {
    if (this.authStateUnsubscriber) {
      this.authStateUnsubscriber();
    }
  }

  public render() {
    const {
      client,
      hasCacheLoaded,
      hasAuthTriggered,
    } = this.state;

    if (!client || !hasCacheLoaded || !hasAuthTriggered) {
      return <View style={styles.splash} />;
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

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: palette.black.default,
  },
});

export default App;
