import { NativeModules } from 'react-native';
import { normalizeLanguage } from 'constants/translations';

const ConfigModule = NativeModules.RNConfig;

export const API_URL = ConfigModule.apiUrl;

export const FIREBASE_WEB_CLIENT_ID = ConfigModule.webClientId;

export const LANGUAGE = normalizeLanguage(ConfigModule.language);
