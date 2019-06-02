import React from 'react';
import { StatusBar } from 'react-native';
import firebase from 'react-native-firebase';
import Sound from 'react-native-sound';
import { Provider } from 'mobx-react/native';
import moment from 'moment';
import 'moment/locale/ko';
import { AuthModal } from 'components';
import * as states from './stores/states';
import { readCoversAction, readUserInfoAction } from './stores/actions';
import Navigator from './Navigator';
import NavigationService from './NavigationService';

// @ts-ignore
Sound.enableInSilenceMode(true);
Sound.setActive(true);

moment.locale('ko');

export default class App extends React.Component {
  private authStateUnsubscriber?: () => void;

  public componentDidMount() {
    this.authStateUnsubscriber = firebase.auth().onAuthStateChanged(readUserInfoAction);
    readCoversAction();
  }

  public componentWillUnmount() {
    if (this.authStateUnsubscriber) {
      this.authStateUnsubscriber();
    }
  }

  public render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Provider {...states}>
          <React.Fragment>
            <AuthModal />
            <Navigator ref={this.setNavigationRef} />
          </React.Fragment>
        </Provider>
      </React.Fragment>
    );
  }

  private setNavigationRef = (ref: any) => {
    NavigationService.setTopLevelNavigator(ref);
  }
}
