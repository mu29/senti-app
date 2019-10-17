import firebase from 'react-native-firebase';

class AnalyticsService {
  public setScreen(screen: string) {
    console.info(`[Analytics] Set current screen: ${screen}`);
    firebase.analytics().setCurrentScreen(screen, screen);
  }

  public logEvent(event: string, params?: { [key: string]: string | number }) {
    console.info(`[Analytics] ${event}${params ? ` with params: ${JSON.stringify(params)}` : ''}`);
    firebase.analytics().logEvent(event, params);
  }

  public logError(error: Error) {
    const { uid = '' } = firebase.auth().currentUser || {};

    firebase.crashlytics().setUserIdentifier(uid);
    firebase.crashlytics().setStringValue('stack', `${error.stack}`);
    firebase.crashlytics().log(`JS Error: ${error.message}`);
  }
}

export default new AnalyticsService();
