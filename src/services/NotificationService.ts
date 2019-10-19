import firebase from 'react-native-firebase';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import {
  FETCH_PROFILE,
  CLEAR_BADGE_COUNT,
  CREATE_FCM_TOKEN,
} from 'graphqls';

class NotificationService {
  private client?: ApolloClient<NormalizedCacheObject>;

  private user?: Profile;

  public hasPermission = false;

  public setClient(client: ApolloClient<NormalizedCacheObject>) {
    this.client = client;
  }

  public setUser(user: Profile) {
    this.user = user;
  }

  public async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    this.hasPermission = enabled;
    return enabled;
  }

  public requestPermission() {
    firebase.messaging().requestPermission()
      .then(() => this.checkPermission())
      .catch(console.error);
  }

  public async refreshToken() {
    const fcmToken = await firebase.messaging().getToken();

    if (fcmToken && this.user && this.client) {
      this.client.mutate({
        mutation: CREATE_FCM_TOKEN,
        variables: { fcmToken },
      });
    }

    firebase.messaging().subscribeToTopic('broadcast');
  }

  public sync() {
    if (!this.client) {
      return;
    }

    this.client.query<{ profile: Profile }>({
      query: FETCH_PROFILE,
      fetchPolicy: 'network-only',
    }).then(({ data }) => {
      if (data && data.profile) {
        firebase.notifications().setBadge(data.profile.badgeCount || 0);
      }
    }).catch(console.error);
  }

  public clearBadge() {
    firebase.notifications().setBadge(0);
    firebase.notifications().removeAllDeliveredNotifications();

    if (this.client) {
      this.client.mutate({ mutation: CLEAR_BADGE_COUNT }).catch(console.error);
    }
  }
}

export default new NotificationService();
