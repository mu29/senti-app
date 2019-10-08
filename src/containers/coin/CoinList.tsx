import React from 'react';
import { NetworkStatus } from 'apollo-client';
import {
  ErrorView,
  LoadingView,
  CoinList,
} from 'components';
import { useCoin } from 'containers';

interface Props {
  setIsLoading: (isLoading: boolean) => void;
}

const Container: React.FunctionComponent<Props> = ({
  setIsLoading,
}) => {
  const {
    coins,
    error,
    networkStatus,
    refetch,
    purchase,
  } = useCoin(setIsLoading);

  if (error || networkStatus === NetworkStatus.error) {
    const reload = () => refetch().catch(console.error);
    return <ErrorView reload={reload} message={error ? error.message : ''} scrollable />;
  }

  if (coins.length === 0) {
    return <LoadingView />;
  }

  return (
    <CoinList items={coins} purchase={purchase} />
  );
};

export default React.memo(Container);
