import firebase from 'react-native-firebase';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import {
  FETCH_PROFILE,
  CLEAR_BADGE_COUNT,
} from 'graphqls';

class NotificationService {
  private client?: ApolloClient<NormalizedCacheObject>;

  public setClient(client: ApolloClient<NormalizedCacheObject>) {
    this.client = client;
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
