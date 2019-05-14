import React from 'react';
import { StatusBar } from 'react-native';
import moment from 'moment';
import 'moment/locale/ko';
import { palette } from 'services/style';
import Navigator from './Navigator';

moment.locale('ko');

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" backgroundColor={palette.gray[100]} />
        <Navigator />
      </React.Fragment>
    );
  }
}
