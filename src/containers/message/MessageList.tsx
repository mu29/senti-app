import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import uniqBy from 'lodash/uniqBy';
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
    data: {
      messageFeed,
    } = {
      messageFeed: undefined,
    },
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
    const reload = () => refetch().catch(console.error);
    return <ErrorView reload={reload} message={error ? error.message : ''} />;
  }

  if (!messageFeed) {
    return <LoadingView />;
  }

  const {
    messages,
    cursor,
  } = messageFeed;

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

          return {
            ...original,
            messageFeed: {
              ...original.messageFeed,
              messages: uniqBy([...original.messageFeed.messages, ...nextMessages], 'id'),
              cursor: nextCursor,
            },
          };
        },
      }).catch(console.error)}
    />
  );
};

export default React.memo(Container);
