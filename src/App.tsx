import React from 'react';
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
  readCoversAction,
  subscribeUserInfoAction,
  unsubscribeUserInfoAction,
} from './stores/actions';
import Navigator from './Navigator';
import NavigationService from './NavigationService';
import client from './apollo';

// @ts-ignore
Sound.enableInSilenceMode(true);
Sound.setActive(true);

moment.locale('ko');

interface AppState {
  isLoaded: boolean;
}

export default class App extends React.Component<{} , AppState> {
  public state = {
    isLoaded: false,
  };

  private authStateUnsubscriber?: () => void;

  public componentDidMount() {
    this.authStateUnsubscriber = firebase.auth().onAuthStateChanged((user) => {
      subscribeUserInfoAction(user).then(() => this.setState({ isLoaded: true }));
    });
    readCoversAction();
  }

  public componentWillUnmount() {
    if (this.authStateUnsubscriber) {
      this.authStateUnsubscriber();
    }
    unsubscribeUserInfoAction();
  }

  public render() {
    if (!this.state.isLoaded) {
      return null;
    }

    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Provider {...states}>
          <ApolloProvider client={client}>
            <React.Fragment>
              <AuthModal />
              <Navigator ref={this.setNavigationRef} />
            </React.Fragment>
          </ApolloProvider>
        </Provider>
      </React.Fragment>
    );
  }

  private setNavigationRef = (ref: any) => {
    NavigationService.setTopLevelNavigator(ref);
  }
}
