import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  ChattingList,
  ChattingEmptyList,
} from 'components';
import { FETCH_CHATTING_FEED } from 'graphqls';
import {
  isFetching,
  canFetchMore,
} from 'utils';

const EMPTY_LIST: Chatting[] = [];

type ChattingFeedResult = {
  chattingFeed: {
    chattings: Chatting[];
    cursor: string;
  };
};

const Container: React.FunctionComponent<{}> = () => {
  const {
    data,
    networkStatus,
    error,
    fetchMore,
    refetch,
  } = useQuery<ChattingFeedResult>(FETCH_CHATTING_FEED, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  if (error || networkStatus === NetworkStatus.error) {
    const reload = () => refetch().catch(() => {});
    return <ErrorView reload={reload} message={error ? error.message : ''} />;
  }

  if (!data || !data.chattingFeed) {
    return <LoadingView />;
  }

  const {
    chattingFeed: {
      chattings,
      cursor,
    },
  } = data;

  if (chattings.length === 0) {
    return <ChattingEmptyList />;
  }

  return (
    <ChattingList
      items={chattings || EMPTY_LIST}
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
            chattingFeed: {
              chattings: nextChattings,
              cursor: nextCursor,
            },
          } = fetchMoreResult;

          if (nextChattings.length === 0) {
            return original;
          }

          return Object.assign(original, {
            chattingFeed: {
              ...original.chattingFeed,
              chattings: original.chattingFeed.chattings.concat(nextChattings),
              cursor: nextCursor,
            },
          });
        },
      }).catch(() => {})}
    />
  );
};

export default React.memo(Container);
