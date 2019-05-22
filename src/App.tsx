import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'mobx-react/native';
import moment from 'moment';
import 'moment/locale/ko';
import { AuthModal } from 'components';
import stores from './stores';
import Navigator from './Navigator';

moment.locale('ko');

export default class App extends React.Component {
  public componentDidMount() {
    stores.authStore.subscribe();
  }

  public componentWillUnmount() {
    stores.authStore.unsubscribe();
  }

  public render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Provider {...stores}>
          <React.Fragment>
            <AuthModal />
            <Navigator />
          </React.Fragment>
        </Provider>
      </React.Fragment>
    );
  }
}
