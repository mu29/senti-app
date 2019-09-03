import React from 'react';
import firebase from 'react-native-firebase';
import { useQuery } from '@apollo/react-hooks';
import { UserInfo } from 'components';
import { FETCH_PROFILE } from 'graphqls';

const Container: React.FunctionComponent<{}> = () => {
  const { data } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    skip: !firebase.auth().currentUser,
    fetchPolicy: 'cache-only',
  });

  if (!data || !data.me) {
    return null;
  }

  return (
    <UserInfo item={data.me} />
  );
};

export default React.memo(Container);
