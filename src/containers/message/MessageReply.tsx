import React, { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { MessageReply } from 'components';
import {
  CREATE_MESSAGE,
  FETCH_MESSAGE_FEED,
} from 'graphqls';

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
  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update: (cache, { data: { createMessage: message } }) => {
      const savedFeed = cache.readQuery<MessageFeedResult>({
        query: FETCH_MESSAGE_FEED,
        variables: {
          chattingId,
        },
      });

      if (!savedFeed) {
        return;
      }

      savedFeed.messageFeed.messages.unshift(message);

      cache.writeQuery({
        query: FETCH_MESSAGE_FEED,
        variables: {
          chattingId,
        },
        data: savedFeed,
      });
    },
  });

  const create = useCallback(async (audio) => {
    await createMessage({
      variables: {
        input: {
          audio,
          chattingId,
        },
      },
    });
  }, [chattingId]);

  return (
    <MessageReply
      create={create}
    />
  );
};

export default React.memo(Container);
