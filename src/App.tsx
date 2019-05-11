import React from 'react';
import Navigator from './Navigator';
import { StatusBar } from 'react-native';

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
