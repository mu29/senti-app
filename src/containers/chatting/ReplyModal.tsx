import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { ReplyModal } from 'components';
import {
  FETCH_PROFILE,
  FETCH_MODAL,
  HIDE_MODAL,
  CREATE_CHATTING,
  FETCH_CHATTING_FEED,
  FETCH_TRANSACTION_FEED,
} from 'graphqls';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

type TransactionFeedResult = {
  transactionFeed: {
    transactions: Transaction[];
    cursor: string;
  };
};

type ChattingFeedResult = {
  chattingFeed: {
    chattings: Chatting[];
    cursor: string;
  };
};

const Container: React.FunctionComponent<{}> = () => {
  const {
    data: {
      modal,
    } = {
      modal: undefined,
    },
  } = useQuery<{ modal: Modal }>(FETCH_MODAL, {
    variables: { id: 'Reply' },
  });

  const {
    data: {
      profile,
    } = {
      profile: undefined,
    },
  } = useQuery<{ profile: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const [hideModal] = useMutation(HIDE_MODAL, {
    variables: { id: 'Reply' },
  });

  const [createChatting] = useMutation(CREATE_CHATTING, {
    update: (cache, { data: { createChatting: { chatting, transaction } } }) => {
      try {
        const data = cache.readQuery<ChattingFeedResult>({
          query: FETCH_CHATTING_FEED,
        });

        if (!data) {
          return;
        }

        cache.writeQuery({
          query: FETCH_CHATTING_FEED,
          data: {
            chattingFeed: {
              ...data.chattingFeed,
              chattings: [chatting, ...data.chattingFeed.chattings],
            },
          },
        });
      } catch {}

      try {
        const data = cache.readQuery<TransactionFeedResult>({
          query: FETCH_TRANSACTION_FEED,
        });

        if (!data || !transaction) {
          return;
        }

        cache.writeQuery({
          query: FETCH_TRANSACTION_FEED,
          data: {
            transactionFeed: {
              ...data.transactionFeed,
              transactions: [transaction, ...data.transactionFeed.transactions],
            },
          },
        });
      } catch {}
    },
  });

  const create = useCallback(async (audio) => {
    const storyId = modal && modal.params && JSON.parse(modal.params).id;

    if (!storyId) {
      throw new Error(LocalizedStrings.STORY_REPLY_FAILURE);
    }

    return new Promise<void>((resolve, reject) => {
      if (!profile) {
        return reject({ message: LocalizedStrings.ERROR_AUTH_REQUIRED });
      }

      const createWithPurchase = (purchase: boolean) => createChatting({
        variables: {
          input: {
            audio,
            storyId,
            purchase,
          },
        },
      }).then(() => {
        AnalyticsService.logEvent('finish_create_chatting');
        resolve();
      }).catch(reject);

      if (profile.coin > 0 || profile.canUseFreeCoinAt < Date.now()) {
        Alert.alert(LocalizedStrings.REPLY_USE_COIN_TITLE, LocalizedStrings.REPLY_USE_COIN_MESSAGE, [{
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
  }, [createChatting, modal, profile]);

  if (!modal) {
    return null;
  }

  return (
    <ReplyModal
      isVisible={modal.isVisible}
      hide={hideModal}
      create={create}
    />
  );
};

export default React.memo(Container);
