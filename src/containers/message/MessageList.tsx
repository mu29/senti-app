import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  MessageList,
} from 'components';
import { FETCH_MESSAGE_FEED } from 'graphqls';
import { isInitialLoading } from 'utils';

const EMPTY_LIST: Message[] = [];

type MessageFeedResult = {
  messageFeed: {
    messages: Message[];
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
    data,
    networkStatus,
    error,
    fetchMore,
    refetch,
  } = useQuery<MessageFeedResult>(FETCH_MESSAGE_FEED, {
    variables: {
      chattingId,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (error) {
    const reload = () => refetch().catch(() => {});
    return <ErrorView reload={reload} message={error.message} />;
  }

  if (isInitialLoading(networkStatus) || !data) {
    return <LoadingView />;
  }

  const {
    messageFeed: {
      messages,
      cursor,
    },
  } = data;

  return (
    <MessageList
      items={messages || EMPTY_LIST}
      isLoading={networkStatus === NetworkStatus.fetchMore}
      onFetchMore={() => fetchMore({
        variables: { cursor },
        updateQuery: (original, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return original;
          }

          const {
            messageFeed: {
              messages: nextMessages,
              cursor: nextCursor,
            },
          } = fetchMoreResult;

          return Object.assign(original, {
            messageFeed: {
              ...original.messageFeed,
              messages: original.messageFeed.messages.concat(nextMessages),
              cursor: nextCursor,
            },
          });
        },
      })}
    />
  );
};

export default React.memo(Container);
