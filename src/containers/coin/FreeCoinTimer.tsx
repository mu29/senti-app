import React from 'react';
import firebase from 'react-native-firebase';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { FreeCoinTimer } from 'components';
import {
  FETCH_PROFILE,
  SHOW_MODAL,
} from 'graphqls';

const Container: React.FunctionComponent<{}> = () => {
  const { data } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    skip: !firebase.auth().currentUser,
    fetchPolicy: 'cache-only',
  });

  const [showModal] = useMutation(SHOW_MODAL, {
    variables: { id: 'Coin' },
  });

  if (!data || !data.me) {
    return null;
  }

  return (
    <FreeCoinTimer
      useFreeCoinAt={data.me.useFreeCoinAt || 0}
      showModal={showModal}
    />
  );
};

export default React.memo(Container);
