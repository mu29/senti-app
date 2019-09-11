import { NativeModules } from 'react-native';

const ConfigModule = NativeModules.RNConfig;

export const API_URL = ConfigModule.apiUrl;

export const FIREBASE_WEB_CLIENT_ID = ConfigModule.webClientId;

export const LANGUAGE = ConfigModule.language;
