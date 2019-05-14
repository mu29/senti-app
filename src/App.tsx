import React from 'react';
import { StatusBar } from 'react-native';
import moment from 'moment';
import 'moment/locale/ko';
import Navigator from './Navigator';

moment.locale('ko');

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        <Navigator />
      </React.Fragment>
    );
  }
}
