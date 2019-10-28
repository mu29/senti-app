import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import uniqBy from 'lodash/uniqBy';
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
    data: {
      transactionFeed,
    } = {
      transactionFeed: undefined,
    },
    networkStatus,
    error,
    fetchMore,
    refetch,
  } = useQuery<TransactionFeedResult>(FETCH_TRANSACTION_FEED, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  if (error || networkStatus === NetworkStatus.error) {
    const reload = () => refetch().catch(console.error);
    return <ErrorView reload={reload} message={error ? error.message : ''} scrollable />;
  }

  if (!transactionFeed) {
    return <LoadingView />;
  }

  const {
    transactions,
    cursor,
  } = transactionFeed;

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

          return {
            ...original,
            transactionFeed: {
              ...original.transactionFeed,
              transactions: uniqBy([...original.transactionFeed.transactions, ...nextTransactions], 'id'),
              cursor: nextCursor,
            },
          };
        },
      }).catch(console.error)}
    />
  );
};

export default React.memo(Container);
