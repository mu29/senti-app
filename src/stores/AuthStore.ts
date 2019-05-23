import { Alert } from 'react-native';
import {
  observable,
  computed,
} from 'mobx';
import moment from 'moment';
import firebase from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';
import {
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk';
import {
  FIREBASE_IOS_CLIENT_ID,
  FIREBASE_WEB_CLIENT_ID,
} from 'constants/env';

class AuthStore {
  @observable
  public user?: User;

  @observable
  public currentProvider?: string;

  private nextRoute?: string;

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

  public setNextRoute = (key: string) => {
    this.nextRoute = key;
  }

  public popNextRoute = () => {
    const route = `${this.nextRoute}`;
    this.nextRoute = undefined;
    return route;
  }

  public signInWithGoogle = async () => {
    this.currentProvider = 'google';

    const configureResult = await this.initGoogleSignin();
    if (!configureResult) {
      Alert.alert('로그인', '구글 플레이 서비스 초기화에 실패했습니다.');
      this.currentProvider = undefined;
      return;
    }

    return GoogleSignin.signIn()
      // @ts-ignore
      .then(data => firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken))
      .then(credential => firebase.auth().signInWithCredential(credential))
      .then(this.createUser)
      .catch((error) => {
        this.currentProvider = undefined;
        throw error;
      });
  }

  public signInWithFacebook = async () => {
    this.currentProvider = 'facebook';

    return LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then((result) => {
        if (result.isCancelled) {
          this.currentProvider = undefined;
          return Promise.reject(new Error('사용자가 로그인을 취소했습니다.'));
        }
        return AccessToken.getCurrentAccessToken();
      })
      // @ts-ignore
      .then(data => firebase.auth.FacebookAuthProvider.credential(data.accessToken))
      .then(credential => firebase.auth().signInWithCredential(credential))
      .then(this.createUser)
      .catch((error) => {
        this.currentProvider = undefined;
        throw error;
      });
  }

  public signOut = () => {
    return firebase.auth().signOut();
  }

  private initGoogleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      await GoogleSignin.configure({
        iosClientId: FIREBASE_IOS_CLIENT_ID,
        webClientId: FIREBASE_WEB_CLIENT_ID,
        offlineAccess: true,
        forceConsentPrompt: true,
      });
    } catch (e) {
      return false;
    }

    return true;
  }

  private createUser = async () => {
    const user = firebase.auth().currentUser;

    if (!user) {
      this.currentProvider = undefined;
      throw new Error('로그인 중 오류가 발생했습니다.');
    }

    const userRef = firebase.firestore().collection('users').doc(user.uid);
    const storedUser = await userRef.get();

    if (!storedUser.exists) {
      await userRef.set({
        id: user.uid,
        email: user.email || (user.providerData && user.providerData[0] && user.providerData[0].email),
        name: user.displayName,
        photoUrl: user.photoURL,
        lastSignInAt: moment(user.metadata.lastSignInTime).valueOf(),
        createdAt: moment(user.metadata.creationTime).valueOf(),
      });
    }

    this.currentProvider = undefined;
  }
}

export default AuthStore;
