import React from 'react';
import { NetworkStatus } from 'apollo-client';
import {
  ErrorView,
  LoadingView,
  CoinList,
} from 'components';
import { useCoin } from 'containers';

const Container: React.FunctionComponent<{}> = () => {
  const {
    coins,
    error,
    networkStatus,
    refetch,
  } = useCoin();

  if (error || networkStatus === NetworkStatus.error) {
    const reload = () => refetch().catch(() => {});
    return <ErrorView reload={reload} message={error ? error.message : ''} />;
  }

  if (coins.length === 0) {
    return <LoadingView />;
  }

  return (
    <CoinList items={coins} />
  );
};

export default React.memo(Container);
