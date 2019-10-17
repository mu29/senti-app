import React, {
  useState,
  useCallback,
} from 'react';
import firebase from 'react-native-firebase';
import {
  withNavigation,
  StackActions,
  NavigationActions,
  NavigationInjectedProps,
} from 'react-navigation';
import {
  useQuery,
  useMutation,
  useApolloClient,
} from '@apollo/react-hooks';
import { EditProfileInfo } from 'components';
import {
  FETCH_PROFILE,
  FETCH_CANDIDATE,
  UPDATE_CANDIDATE,
  REMOVE_FCM_TOKEN,
} from 'graphqls';

const Container: React.FunctionComponent<NavigationInjectedProps> = ({
  navigation,
}) => {
  const client = useApolloClient();

  const [isLoading, setIsLoading] = useState(false);

  const {
    data: {
      profile,
    } = {
      profile: undefined,
    },
  } = useQuery<{ profile: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const {
    data: {
      candidate,
    } = {
      candidate: undefined,
    },
  } = useQuery<{ candidate: Candidate }>(FETCH_CANDIDATE);

  const [updateCandidate] = useMutation(UPDATE_CANDIDATE);

  const update = useCallback((value: Candidate) => {
    updateCandidate({ variables: value });
  }, [updateCandidate]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    firebase.messaging().getToken()
      .then(token => token && client.mutate({
        mutation: REMOVE_FCM_TOKEN,
        variables: {
          fcmToken: token,
        },
      }))
      .catch(console.error)
      .finally(() => {
        firebase.auth().signOut()
          .then(() => client.resetStore())
          .then(() => setIsLoading(false))
          .then(() => {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'MainStack' })],
            });
            navigation.dispatch(resetAction);
          })
          .catch(console.error);
      });
  }, [client, navigation]);

  if (!profile || !candidate) {
    return null;
  }

  return (
    <EditProfileInfo
      profile={profile}
      candidate={candidate}
      isLoading={isLoading}
      updateCandidate={update}
      signOut={signOut}
    />
  );
};

export default withNavigation(React.memo(Container));
