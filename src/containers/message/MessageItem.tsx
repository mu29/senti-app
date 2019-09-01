import React from 'react';
import firebase from 'react-native-firebase';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { MessageItem } from 'components';
import {
  FETCH_PROFILE,
} from 'graphqls';

interface Props {
  item: Message;
}

const Container: React.FunctionComponent<Props> = ({
  item,
}) => {
  const { data: profile } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    skip: !firebase.auth().currentUser,
    fetchPolicy: 'cache-only',
  });

  if (!profile || !profile.me) {
    return null;
  }

  return (
    <MessageItem
      item={item}
      userId={profile.me.id}
      isLoading={false}
      loadAudio={() => Promise.resolve()}
    />
  );
};

export default React.memo(Container);
