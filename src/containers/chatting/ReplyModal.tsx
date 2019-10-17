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
} from 'graphqls';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

type ChattingFeedResult = {
  chattingFeed: {
    chattings: Chatting[];
    cursor: string;
  };
};

const ReplyModalContainer: React.FunctionComponent<{}> = () => {
  const { data } = useQuery(FETCH_MODAL, {
    variables: { id: 'Reply' },
  });

  const { data: profile } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const [hideModal] = useMutation(HIDE_MODAL, {
    variables: { id: 'Reply' },
  });

  const [createChatting] = useMutation(CREATE_CHATTING, {
    update: (cache, { data: { createChatting: { chatting, me } } }) => {
      try {
        const savedFeed = cache.readQuery<ChattingFeedResult>({
          query: FETCH_CHATTING_FEED,
        });

        if (!savedFeed) {
          return;
        }

        cache.writeQuery({
          query: FETCH_CHATTING_FEED,
          data: {
            chattingFeed: {
              ...savedFeed.chattingFeed,
              chattings: [chatting, ...savedFeed.chattingFeed.chattings],
            },
          },
        });
      } catch {}

      try {
        const savedProfile = cache.readQuery<{ me: Profile }>({
          query: FETCH_PROFILE,
        });

        if (!savedProfile) {
          return;
        }

        cache.writeQuery({
          query: FETCH_PROFILE,
          data: {
            me: {
              ...savedProfile.me,
              ...me,
            },
          },
        });
      } catch {}
    },
  });

  const create = useCallback(async (audio) => {
    const storyId = data && data.modal && data.modal.params && JSON.parse(data.modal.params).id;

    if (!storyId) {
      throw new Error(LocalizedStrings.STORY_REPLY_FAILURE);
    }

    return new Promise<void>((resolve, reject) => {
      if (!profile || !profile.me) {
        return reject({ message: LocalizedStrings.ERROR_AUTH_REQUIRED });
      }

      const createWithCoin = (useCoin: boolean) => createChatting({
        variables: {
          input: {
            audio,
            storyId,
            useCoin,
          },
        },
      }).then(() => {
        AnalyticsService.logEvent('finish_create_chatting');
        resolve();
      }).catch(reject);

      if (profile.me.coin > 0 || profile.me.canUseFreeCoinAt < Date.now()) {
        Alert.alert(LocalizedStrings.REPLY_USE_COIN_TITLE, LocalizedStrings.REPLY_USE_COIN_MESSAGE, [{
          text: LocalizedStrings.COMMON_CONFIRM,
          onPress: () => createWithCoin(true),
        }, {
          text: LocalizedStrings.COMMON_CANCEL,
          onPress: () => createWithCoin(false),
          style: 'cancel',
        }]);
      } else {
        createWithCoin(false);
      }
    });
  }, [createChatting, data, profile]);

  if (!data || !data.modal) {
    return null;
  }

  return (
    <ReplyModal
      isVisible={data.modal.isVisible}
      hide={hideModal}
      create={create}
    />
  );
};

export default React.memo(ReplyModalContainer);
