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

        savedFeed.chattingFeed.chattings.unshift(chatting);

        cache.writeQuery({
          query: FETCH_CHATTING_FEED,
          data: savedFeed,
        });
      } catch {}
    },
  });

  const create = useCallback(async (audio) => {
    const storyId = data && data.modal && data.modal.params && JSON.parse(data.modal.params).id;

    if (!storyId) {
      throw new Error('이 이야기에는 답장할 수 없습니다.');
    }

    await createChatting({
      variables: {
        input: {
          audio,
          storyId,
        },
      },
    });
  }, [data && data.modal && data.modal.params]);

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
