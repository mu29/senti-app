import { NativeModules } from 'react-native';

const ConfigModule = NativeModules.RNConfig;

export const APP_VERSION = ConfigModule.appVersion;

export const PACKAGE_NAME = ConfigModule.packageName;

export const API_URL = ConfigModule.apiUrl;

export const DYNAMIC_LINK_HOST = ConfigModule.dynamicLinkHost;

export const WEBSITE_URL = ConfigModule.websiteUrl;

export const FIREBASE_WEB_CLIENT_ID = ConfigModule.webClientId;

export const LANGUAGE = ['ko'].includes(ConfigModule.language) ? ConfigModule.language : 'ko';
