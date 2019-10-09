import {
  AppRegistry,
  YellowBox,
} from 'react-native';
import 'react-native-gesture-handler';
import App from './src/App';
import { name as appName } from './app.json';

if (__DEV__) {
  YellowBox.ignoreWarnings([
    'componentWillReceiveProps has been renamed',
  ]);
}

AppRegistry.registerComponent(appName, () => App);
