import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'mobx-react/native';
import moment from 'moment';
import 'moment/locale/ko';
import stores from './stores';
import Navigator from './Navigator';

moment.locale('ko');

export default class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Provider {...stores}>
          <Navigator />
        </Provider>
      </React.Fragment>
    );
  }
}
