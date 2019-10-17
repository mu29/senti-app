import React, {
  useCallback,
  useState,
} from 'react';
import { Alert } from 'react-native';
import {
  useQuery,
  useApolloClient,
  useMutation,
} from '@apollo/react-hooks';
import { MessageItem } from 'components';
import {
  FETCH_PROFILE,
  PURCHASE_MESSAGE,
  FETCH_CHATTING,
  READ_MESSAGE,
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
    fetchPolicy: 'cache-only',
  });

  const [purchaseMessage] = useMutation(PURCHASE_MESSAGE, {
    variables: {
      chattingId,
      id: item.id,
    }
  });

  const [readMessage] = useMutation(READ_MESSAGE, {
    variables: {
      chattingId,
      id: item.id,
    }
  });

  const loadAudio = useCallback(() => {
    setIsLoading(true);
    purchaseMessage()
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
      readMessage={readMessage}
    />
  );
};

export default React.memo(Container);
