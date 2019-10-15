import {
  AppRegistry,
  YellowBox,
  Platform,
} from 'react-native';
import 'react-native-gesture-handler';
import App from './src/App';
import MessageBackground from './src/MessageBackground';
import { name as appName } from './app.json';

if (__DEV__) {
  YellowBox.ignoreWarnings([
    'componentWillReceiveProps has been renamed',
  ]);
}

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'android') {
  AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => MessageBackground);
}
