import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import uniqBy from 'lodash/uniqBy';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { MessageReply } from 'components';
import {
  FETCH_PROFILE,
  CREATE_MESSAGE,
  FETCH_MESSAGE_FEED,
} from 'graphqls';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

type MessageFeedResult = {
  messageFeed: {
    messages: Chatting[];
    cursor: string;
  };
};

interface Props {
  chattingId: string;
}

const Container: React.FunctionComponent<Props> = ({
  chattingId,
}) => {
  const {
    data: {
      profile,
    } = {
      profile: undefined,
    },
  } = useQuery<{ profile: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update: (cache, { data: { createMessage: { message } } }) => {
      try {
        const data = cache.readQuery<MessageFeedResult>({
          query: FETCH_MESSAGE_FEED,
          variables: {
            chattingId,
          },
        });

        if (!data) {
          return;
        }

        cache.writeQuery({
          query: FETCH_MESSAGE_FEED,
          variables: {
            chattingId,
          },
          data: {
            messageFeed: {
              ...data.messageFeed,
              messages: uniqBy([message, ...data.messageFeed.messages], 'id'),
            },
          },
        });
      } catch {}
    },
  });

  const create = useCallback(async (audio) => {
    return new Promise<void>((resolve, reject) => {
      if (!profile) {
        return reject({ message: LocalizedStrings.ERROR_AUTH_REQUIRED });
      }

      const createWithPurchase = (purchase: boolean) => createMessage({
        variables: {
          input: {
            audio,
            chattingId,
            purchase,
          },
        },
      }).then(() => {
        AnalyticsService.logEvent('finish_create_message');
        resolve();
      }).catch(reject);

      const canUseCoin = profile.coin > 0;
      const canUseFreeCoin = profile.canUseFreeCoinAt < Date.now();
      const message = canUseFreeCoin
        ? LocalizedStrings.REPLY_USE_FREE_COIN_MESSAGE
        : LocalizedStrings.REPLY_USE_COIN_MESSAGE;

      if (canUseCoin || canUseFreeCoin) {
        Alert.alert(LocalizedStrings.REPLY_USE_COIN_TITLE, message, [{
          text: LocalizedStrings.COMMON_CONFIRM,
          onPress: () => createWithPurchase(true),
        }, {
          text: LocalizedStrings.COMMON_CANCEL,
          onPress: () => createWithPurchase(false),
          style: 'cancel',
        }]);
      } else {
        createWithPurchase(false);
      }
    });
  }, [chattingId, createMessage]);

  return (
    <MessageReply create={create} />
  );
};

export default React.memo(Container);
