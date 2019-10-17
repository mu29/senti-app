import React, {
  useCallback,
  useState,
} from 'react';
import { Alert } from 'react-native';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { MessageItem } from 'components';
import {
  FETCH_PROFILE,
  PURCHASE_MESSAGE,
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

  const {
    data: {
      profile,
    } = {
      profile: undefined,
    },
  } = useQuery<{ profile: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const [purchaseMessage] = useMutation(PURCHASE_MESSAGE, {
    variables: {
      chattingId,
      id: item.id,
    },
  });

  const [readMessage] = useMutation(READ_MESSAGE, {
    variables: {
      chattingId,
      id: item.id,
    },
  });

  const loadAudio = useCallback(() => {
    setIsLoading(true);
    purchaseMessage()
      .catch(e => Alert.alert(
        LocalizedStrings.COMMON_ERROR,
        LocalizedStrings.MESSAGE_PLAY_FAILURE(e.message),
      ))
      .finally(() => setIsLoading(false));
  }, [purchaseMessage]);

  if (!profile) {
    return null;
  }

  return (
    <MessageItem
      item={item}
      profile={profile}
      isLoading={isLoading}
      loadAudio={loadAudio}
      readMessage={readMessage}
    />
  );
};

export default React.memo(Container);
