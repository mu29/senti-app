import React from 'react';
import firebase from 'react-native-firebase';
import {
  useQuery,
  useLazyQuery,
} from '@apollo/react-hooks';
import { MessageItem } from 'components';
import {
  FETCH_PROFILE,
  FETCH_AUDIO,
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

  const [fetchAudio, { data, loading }] = useLazyQuery(FETCH_AUDIO, {
    variables: {
      id: item.id,
    },
  });

  if (!profile || !profile.me) {
    return null;
  }

  return (
    <MessageItem
      item={item}
      userId={profile.me.id}
      isLoading={loading}
      loadAudio={fetchAudio}
    />
  );
};

export default React.memo(Container);
