import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import firebase from 'react-native-firebase';
import {
  useQuery,
  useApolloClient,
} from '@apollo/react-hooks';
import { MessageItem } from 'components';
import {
  FETCH_PROFILE,
  FETCH_MESSAGE,
} from 'graphqls';

interface Props {
  chattingId: string;
  item: Message;
}

const Container: React.FunctionComponent<Props> = ({
  chattingId,
  item,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const client = useApolloClient();

  const { data: profile } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    skip: !firebase.auth().currentUser,
    fetchPolicy: 'cache-only',
  });

  const loadAudio = useCallback(() => {
    setIsLoading(true);
    client.query({
      query: FETCH_MESSAGE,
      variables: {
        chattingId,
        id: item.id,
      },
      fetchPolicy: 'network-only',
    })
    .catch(e => Alert.alert('오류', `메시지 재생에 실패했습니다.\n${e.message}`))
    .finally(() => setIsLoading(false));
  }, [chattingId, client, item.id]);

  if (!profile || !profile.me) {
    return null;
  }

  return (
    <MessageItem
      item={item}
      userId={profile.me.id}
      isLoading={isLoading}
      loadAudio={loadAudio}
    />
  );
};

export default React.memo(Container);
