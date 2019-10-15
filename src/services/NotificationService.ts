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

    this.client.query<{ me: Profile }>({
      query: FETCH_PROFILE,
      fetchPolicy: 'network-only',
    }).then(({ data }) => {
      firebase.notifications().setBadge(data.me.badgeCount);
    }).catch(console.error);
  }

  public clearBadge() {
    firebase.notifications().setBadge(0);
    firebase.notifications().removeAllDeliveredNotifications();

    if (this.client) {
      this.client.mutate({ mutation: CLEAR_BADGE_COUNT });
    }
  }
}

export default new NotificationService();
