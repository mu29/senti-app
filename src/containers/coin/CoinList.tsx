import React, {
  useState,
  useEffect,
} from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import InAppPurchase from 'react-native-in-app-purchase';
import {
  ErrorView,
  LoadingView,
  CoinList,
} from 'components';
import { FETCH_COIN_LIST } from 'graphqls';
import { Alert } from 'react-native';

type CoinListResult = {
  coins: Coin[];
};

const Container: React.FunctionComponent<{}> = () => {
  const [coins, setCoins] = useState<Coin[]>([]);

  const {
    data,
    networkStatus,
    error,
    refetch,
  } = useQuery<CoinListResult>(FETCH_COIN_LIST, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (!data || !data.coins) {
      return;
    }

    const productIds = data.coins.map(c => c.id);

    InAppPurchase.configure().then(() => {
      InAppPurchase.fetchProducts(productIds);
    });
  }, [data && data.coins]);

  useEffect(() => {
    if (!data || !data.coins) {
      return;
    }

    InAppPurchase.onFetchProducts(products => {
      const productIds = products.map(p => p.productId);
      setCoins(data.coins.filter(c => productIds.includes(c.id)));
    });
    InAppPurchase.onError(e => Alert.alert('오류', e.message));
    InAppPurchase.onPurchase((purchase) => {
      setTimeout(() => {
        InAppPurchase.finalize(purchase).then(() => {
          Alert.alert('In App Purchase', 'Purchase Succeed!');
        });
      });
    });
  }, []);

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
