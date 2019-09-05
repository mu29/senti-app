import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  MessageList,
} from 'components';
import { FETCH_MESSAGE_FEED } from 'graphqls';
import {
  isFetching,
  canFetchMore,
} from 'utils';

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
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  if (error || networkStatus === NetworkStatus.error) {
    const reload = () => refetch().catch(() => {});
    return <ErrorView reload={reload} message={error ? error.message : ''} />;
  }

  if (!data || !data.messageFeed) {
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
      chattingId={chattingId}
      items={messages || EMPTY_LIST}
      isLoading={isFetching(networkStatus)}
      isRefreshing={networkStatus === NetworkStatus.refetch}
      onRefresh={refetch}
      onFetchMore={() => canFetchMore(networkStatus, error) && fetchMore({
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

          if (nextMessages.length === 0) {
            return original;
          }

          return Object.assign(original, {
            messageFeed: {
              ...original.messageFeed,
              messages: original.messageFeed.messages.concat(nextMessages),
              cursor: nextCursor,
            },
          });
        },
      }).catch(() => {})}
    />
  );
};

export default React.memo(Container);
