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
import { FIREBASE_WEB_CLIENT_ID } from 'constants/config';
import {
  CREATE_USER,
  FETCH_PROFILE,
} from 'graphqls';
import { LocalizedStrings } from 'constants/translations';

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
    }).catch(console.error);

    if (onSuccess) {
      onSuccess();
    }
  }, [client, onSuccess]);

  const signInWithGoogle = useCallback(async () => {
    if (provider) {
      return;
    }
    setProvider('google');

    const configureResult = await initGoogleSignin();
    if (!configureResult) {
      Alert.alert(LocalizedStrings.COMMON_ERROR, LocalizedStrings.LOGIN_FAILURE_GOOGLE_PLAY_SERVICE);
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
        if (error.code !== '12501' && error.code !== '-5') {
          Alert.alert(LocalizedStrings.COMMON_ERROR, LocalizedStrings.LOGIN_FAILURE_GOOGLE(error.message));
        }
      })
      .finally(() => {
        setProvider(undefined);
      });
  }, [createUser, provider, resultHandler]);

  const signInWithFacebook = useCallback(() => {
    if (provider) {
      return;
    }
    setProvider('facebook');

    return LoginManager.logInWithPermissions(['public_profile', 'email'])
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
          Alert.alert(LocalizedStrings.COMMON_ERROR, LocalizedStrings.LOGIN_FAILURE_FACEBOOK(error.message));
        }
      })
      .finally(() => {
        setProvider(undefined);
      });
  }, [createUser, provider, resultHandler]);

  return {
    provider,
    signInWithGoogle,
    signInWithFacebook,
  };
}

export default useAuth;
