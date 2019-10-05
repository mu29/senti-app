import React, {
  useCallback,
  useState,
} from 'react';
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
  FETCH_CHATTING,
} from 'graphqls';
import { LocalizedStrings } from 'constants/translations';

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
    .then(() => Promise.all([
      client.query({
        query: FETCH_CHATTING,
        variables: {
          id: chattingId,
        },
        fetchPolicy: 'network-only',
      }),
      client.query({
        query: FETCH_PROFILE,
        fetchPolicy: 'network-only',
      }),
    ]))
    .catch(e => Alert.alert(
      LocalizedStrings.COMMON_ERROR,
      LocalizedStrings.MESSAGE_PLAY_FAILURE(e.message),
    ))
    .finally(() => setIsLoading(false));
  }, [chattingId, client, item.id]);

  if (!profile || !profile.me) {
    return null;
  }

  return (
    <MessageItem
      item={item}
      profile={profile.me}
      isLoading={isLoading}
      loadAudio={loadAudio}
    />
  );
};

export default React.memo(Container);
