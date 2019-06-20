import { Alert } from 'react-native';
import { runInAction } from 'mobx';
import firebase, { RNFirebase } from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';
import {
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk';
import { authState } from 'stores/states';
import {
  FIREBASE_IOS_CLIENT_ID,
  FIREBASE_WEB_CLIENT_ID,
} from 'constants/env';
import { LoadingType } from 'constants/enums';
import NavigationService from '../../NavigationService';

export function showAuthModalAction() {
  authState.isModalVisible = true;
}

export function hideAuthModalAction() {
  authState.isModalVisible = false;
}

export function subscribeUserInfoAction(user: RNFirebase.User | null) {
  if (!user) {
    authState.user = undefined;
    return Promise.resolve(true);
  }

  unsubscribeUserInfoAction();

  return new Promise((resolve) => {
    const observer = firebase.firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          authState.user = snapshot.data() as User;
          resolve(true);
        } else {
          createUserInfo();
        }
      });

    authState.unsubscriber = observer;
  });
}

export function unsubscribeUserInfoAction() {
  if (authState.unsubscriber) {
    authState.unsubscriber();
  }
}

export async function signInWithGoogleAction() {
  if (authState.currentProvider) {
    return;
  }
  authState.currentProvider = 'google';

  const configureResult = await initGoogleSignin();
  if (!configureResult) {
    Alert.alert('로그인', '구글 플레이 서비스 초기화에 실패했습니다.');
    authState.currentProvider = undefined;
    return;
  }

  return GoogleSignin.signIn()
    // @ts-ignore
    .then(data => firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken))
    .then(credential => firebase.auth().signInWithCredential(credential))
    .then(createUserInfo)
    .then(handleNextRoute)
    .catch((error) => {
      authState.currentProvider = undefined;
      if (error.code === '-5') {
        return false;
      } else {
        throw error;
      }
    });
}

export async function signInWithFacebookAction() {
  if (authState.currentProvider) {
    return;
  }
  authState.currentProvider = 'facebook';

  return LoginManager.logInWithReadPermissions(['public_profile', 'email'])
    .then((result) => {
      if (result.isCancelled) {
        authState.currentProvider = undefined;
        return Promise.reject({ code: 'user_cancel' });
      }
      return AccessToken.getCurrentAccessToken();
    })
    // @ts-ignore
    .then(data => firebase.auth.FacebookAuthProvider.credential(data.accessToken))
    .then(credential => firebase.auth().signInWithCredential(credential))
    .then(createUserInfo)
    .then(handleNextRoute)
    .catch((error) => {
      authState.currentProvider = undefined;
      if (error.code === 'user_cancel') {
        return false;
      } else {
        throw error;
      }
    });
}

export async function signOutAction() {
  authState.isLoading = LoadingType.DESTROY;
  NavigationService.reset('MainStack');
  await firebase.auth().signOut();
  authState.isLoading = LoadingType.NONE;
}

export function setNextRouteAction(route: string) {
  authState.nextRoute = route;
}

async function createUserInfo() {
  const user = firebase.auth().currentUser;

  if (!user) {
    firebase.auth().signOut();
    authState.currentProvider = undefined;
    throw new Error('로그인 중 오류가 발생했습니다.');
  }

  const userRef = firebase.firestore().collection('users').doc(user.uid);
  const snapshot = await userRef.get();

  const now = new Date().getTime();
  const userData = {
    id: user.uid,
    email: user.email || (user.providerData && user.providerData[0] && user.providerData[0].email),
    name: user.displayName,
    photoUrl: user.photoURL,
    subscribedTags: [],
    lastSignInAt: now,
    createdAt: now,
  };

  if (!snapshot.exists) {
    await userRef.set(userData);
  }

  runInAction(() => {
    authState.user = userData;
    authState.currentProvider = undefined;
  });

  return true;
}

function handleNextRoute() {
  if (authState.nextRoute) {
    NavigationService.navigate(authState.nextRoute);
    authState.nextRoute = undefined;
  }

  return true;
}

async function initGoogleSignin() {
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
