import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  TransactionList,
} from 'components';
import { FETCH_TRANSACTION_FEED } from 'graphqls';
import {
  isFetching,
  canFetchMore,
} from 'utils';

const EMPTY_LIST: Transaction[] = [];

type TransactionFeedResult = {
  transactionFeed: {
    transactions: Transaction[];
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
  } = useQuery<TransactionFeedResult>(FETCH_TRANSACTION_FEED, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  if (error || networkStatus === NetworkStatus.error) {
    const reload = () => refetch().catch(() => {});
    return <ErrorView reload={reload} message={error ? error.message : ''} scrollable />;
  }

  if (!data || !data.transactionFeed) {
    return <LoadingView />;
  }

  const {
    transactionFeed: {
      transactions,
      cursor,
    },
  } = data;

  return (
    <TransactionList
      items={transactions || EMPTY_LIST}
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
            transactionFeed: {
              transactions: nextTransactions,
              cursor: nextCursor,
            },
          } = fetchMoreResult;

          if (nextTransactions.length === 0) {
            return original;
          }

          return Object.assign(original, {
            transactionFeed: {
              ...original.transactionFeed,
              transactions: original.transactionFeed.transactions.concat(nextTransactions),
              cursor: nextCursor,
            },
          });
        },
      }).catch(() => {})}
    />
  );
};

export default React.memo(Container);
