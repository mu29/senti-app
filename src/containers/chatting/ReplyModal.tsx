import React, { useCallback } from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { ReplyModal } from 'components';
import {
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

  const [hideModal] = useMutation(HIDE_MODAL, {
    variables: { id: 'Reply' },
  });

  const [createChatting] = useMutation(CREATE_CHATTING, {
    update: (cache, { data: { createChatting: chatting } }) => {
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
            }
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

    await createChatting({
      variables: {
        input: {
          audio,
          storyId,
        },
      },
    });
    AnalyticsService.logEvent('finish_create_chatting');
  }, [createChatting, data]);

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
