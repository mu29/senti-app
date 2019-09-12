import firebase from 'react-native-firebase';

class AnalyticsService {
  public setScreen(screen: string) {
    console.info(`[Analytics] Set current screen: ${screen}`);
    firebase.analytics().setCurrentScreen(screen);
  }

  public logEvent(event: string, params?: { [key: string]: string | number }) {
    console.info(`[Analytics] ${event}${params ? ` with params: ${JSON.stringify(params)}` : ''}`);
    firebase.analytics().logEvent(event, params);
  }
}

export default new AnalyticsService();
