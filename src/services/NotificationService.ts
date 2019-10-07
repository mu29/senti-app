import firebase from 'react-native-firebase';
import ApolloClient from 'apollo-client';
import { CREATE_FCM_TOKEN } from 'graphqls';

class NotificationService {
  public hasPermission = false;

  private client?: ApolloClient<any>;

  public async configure(client: ApolloClient<any>) {
    if (this.hasPermission || !client) {
      return;
    }

    this.client = client;
    this.checkPermission().then(enabled => enabled
      ? this.refreshToken()
      : this.requestPermission()
    );
  }

  private async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();

    if (enabled) {
      this.hasPermission = true;
    }

    return enabled;
  }

  private async requestPermission() {
    await firebase.messaging().requestPermission().catch(() => {});
    this.checkPermission();
  }

  private async refreshToken() {
    const fcmToken = await firebase.messaging().getToken();

    if (fcmToken && this.client) {
      this.client.mutate({
        mutation: CREATE_FCM_TOKEN,
        variables: { fcmToken },
      });
    }
  }
}

export default new NotificationService();
