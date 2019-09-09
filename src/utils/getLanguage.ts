import {
  Platform,
  NativeModules,
} from 'react-native';

export default () => {
  let locale = '';
  if (Platform.OS === 'ios') {
    locale = NativeModules.SettingsManager.settings.AppleLocale;
  } else {
    locale = NativeModules.I18nManager.localeIdentifier;
  }
  return locale.replace(/[_-].*/, '') || 'en';
};
