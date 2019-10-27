import {
  NativeModules,
  Platform,
  PixelRatio,
} from 'react-native';

const ConfigModule = NativeModules.RNConfig;

export const APP_VERSION = ConfigModule.appVersion;

export const PACKAGE_NAME = ConfigModule.packageName;

export const API_URL = ConfigModule.apiUrl;

export const DYNAMIC_LINK_HOST = ConfigModule.dynamicLinkHost;

export const WEBSITE_URL = ConfigModule.websiteUrl;

export const FIREBASE_WEB_CLIENT_ID = ConfigModule.webClientId;

export const LANGUAGE = ['ko', 'en'].includes(ConfigModule.language) ? ConfigModule.language : 'en';

export const SCREEN_WIDTH = Platform.select({
  android: ConfigModule.screenWidth / PixelRatio.get(),
  ios: ConfigModule.screenWidth,
});

export const SCREEN_HEIGHT = Platform.select({
  android: ConfigModule.screenHeight / PixelRatio.get(),
  ios: ConfigModule.screenHeight,
});
