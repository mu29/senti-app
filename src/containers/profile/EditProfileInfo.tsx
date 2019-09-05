import React, { useCallback, useState } from 'react';
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
} from 'graphqls';

const Container: React.FunctionComponent<NavigationInjectedProps> = ({
  navigation,
}) => {
  const client = useApolloClient();

  const { data: profile } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    skip: !firebase.auth().currentUser,
    fetchPolicy: 'cache-only',
  });

  const { data } = useQuery<{ candidate: Candidate }>(FETCH_CANDIDATE);

  const [updateCandidate] = useMutation(UPDATE_CANDIDATE);

  const update = useCallback((candidate: Candidate) => {
    updateCandidate({ variables: candidate });
  }, []);

  const signOut = useCallback(async () => {
    await firebase.auth().signOut();
    client.resetStore().then(() => {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'MainStack' })],
      });
      navigation.dispatch(resetAction);
    });
  }, []);

  if (!profile || !profile.me || !data || !data.candidate) {
    return null;
  }

  return (
    <EditProfileInfo
      profile={profile.me}
      candidate={data.candidate}
      updateCandidate={update}
      signOut={signOut}
    />
  );
};

export default withNavigation(React.memo(Container));
