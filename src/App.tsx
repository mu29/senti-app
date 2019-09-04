import React from 'react';
import { StatusBar } from 'react-native';
import { ApolloProvider } from '@apollo/react-hooks';
import firebase from 'react-native-firebase';
import Sound from 'react-native-sound';
import moment from 'moment';
import 'moment/locale/ko';
import { AuthModal } from 'containers';
import { FETCH_PROFILE } from './graphqls';
import Navigator from './Navigator';
import NavigationService from './NavigationService';
import client from './apollo';

// @ts-ignore
Sound.enableInSilenceMode(true);
Sound.setActive(true);

moment.locale('ko');

interface State {
  hasAuthTriggered: boolean;
}

class App extends React.Component<{}, State> {
  public state = {
    hasAuthTriggered: false,
  };

  private authStateUnsubscriber?: () => void;

  constructor(props: {}) {
    super(props);
    this.authStateUnsubscriber = firebase.auth().onAuthStateChanged(() => {
      client.query({
        query: FETCH_PROFILE,
        fetchPolicy: 'network-only',
      })
      .finally(() => this.setState({ hasAuthTriggered: true }));
    });
  }

  public componentWillUnmount() {
    if (this.authStateUnsubscriber) {
      this.authStateUnsubscriber();
    }
  }

  public render() {
    const { hasAuthTriggered } = this.state;

    if (!hasAuthTriggered) {
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
