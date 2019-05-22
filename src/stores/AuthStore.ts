import {
  observable,
  computed,
} from 'mobx';
import firebase from 'react-native-firebase';

class AuthStore {
  @observable
  public user?: User;

  private authStateUnsubscriber?: () => void;

  @computed
  public get isLoggedIn() {
    return this.user !== undefined;
  }

  public subscribe = () => {
    this.authStateUnsubscriber = firebase.auth().onAuthStateChanged((user) => {
      this.user = user || undefined;
    });
  }

  public unsubscribe = () => {
    if (this.authStateUnsubscriber) {
      this.authStateUnsubscriber();
    }
  }
}

export default AuthStore;
