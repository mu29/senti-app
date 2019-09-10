import {
  useState,
  useCallback,
} from 'react';
import { Alert } from 'react-native';
import firebase from 'react-native-firebase';
import {
  useMutation,
  useApolloClient,
} from '@apollo/react-hooks';
import { GoogleSignin } from 'react-native-google-signin';
import {
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk';
import { FIREBASE_WEB_CLIENT_ID } from 'constants/env';
import {
  CREATE_USER,
  FETCH_PROFILE,
} from 'graphqls';

type ProviderType = 'facebook' | 'google' | undefined;

async function initGoogleSignin() {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    GoogleSignin.configure({
      webClientId: FIREBASE_WEB_CLIENT_ID,
      offlineAccess: true,
      forceConsentPrompt: true,
    });
  } catch (e) {
    return false;
  }

  return true;
}

function useAuth(onSuccess?: () => void) {
  const [provider, setProvider] = useState<ProviderType>(undefined);

  const [createUser] = useMutation<User>(CREATE_USER);

  const client = useApolloClient();

  const resultHandler = useCallback(async (result) => {
    if (!result) {
      throw new Error('');
    }

    if (result.errors) {
      throw new Error(result.errors[0]);
    }

    await client.query({
      query: FETCH_PROFILE,
      fetchPolicy: 'network-only',
    });

    if (onSuccess) {
      onSuccess();
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (provider) {
      return;
    }
    setProvider('google');

    const configureResult = await initGoogleSignin();
    if (!configureResult) {
      Alert.alert('로그인', '구글 로그인에 실패했습니다.\n구글 플레이 서비스 초기화에 실패했습니다.');
      setProvider(undefined);
      return;
    }

    return GoogleSignin.signIn()
      // @ts-ignore
      .then(data => firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken))
      .then(credential => firebase.auth().signInWithCredential(credential))
      .then(credential => createUser({
        variables: {
          email: credential.user.email,
        },
      }))
      .then(resultHandler)
      .catch((error) => {
        if (error.code !== '-5') {
          Alert.alert('로그인', `구글 로그인에 실패했습니다.\n${error.message}`);
        }
      })
      .finally(() => {
        setProvider(undefined);
      });
  }, [provider]);

  const signInWithFacebook = useCallback(() => {
    if (provider) {
      return;
    }
    setProvider('facebook');

    return LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then((result) => {
        if (result.isCancelled) {
          return Promise.reject({ code: 'user_cancel' });
        }
        return AccessToken.getCurrentAccessToken();
      })
      // @ts-ignore
      .then(data => firebase.auth.FacebookAuthProvider.credential(data.accessToken))
      .then(credential => firebase.auth().signInWithCredential(credential))
      .then(credential => createUser({
        variables: {
          email: credential.user.email,
        },
      }))
      .then(resultHandler)
      .catch((error) => {
        if (error.code !== 'user_cancel') {
          Alert.alert('로그인', `페이스북 로그인에 실패했습니다.\n${error.message}`);
        }
      })
      .finally(() => {
        setProvider(undefined);
      });
  }, [provider]);

  return {
    provider,
    signInWithGoogle,
    signInWithFacebook,
  };
}

export default useAuth;
