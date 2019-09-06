import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  CoinList,
} from 'components';
import { FETCH_COIN_LIST } from 'graphqls';

type CoinListResult = {
  coins: Coin[];
};

const Container: React.FunctionComponent<{}> = () => {
  const {
    data,
    networkStatus,
    error,
    refetch,
  } = useQuery<CoinListResult>(FETCH_COIN_LIST, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  if (error || networkStatus === NetworkStatus.error) {
    const reload = () => refetch().catch(() => {});
    return <ErrorView reload={reload} message={error ? error.message : ''} />;
  }

  if (!data || !data.coins) {
    return <LoadingView />;
  }

  return (
    <CoinList items={data.coins} />
  );
};

export default React.memo(Container);
