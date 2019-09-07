import {
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Alert,
  Platform,
} from 'react-native';
import InAppPurchase, {
  Product,
  Purchase,
} from 'react-native-in-app-purchase';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import {
  FETCH_COIN_LIST,
  VERIFY_COIN_RECEIPT,
} from 'graphqls';

type CoinListResult = {
  coins: Coin[];
};

function useCoin(setIsLoading: (isLoading: boolean) => void) {
  const [coins, setCoins] = useState<Coin[]>([]);

  const {
    data,
    error,
    networkStatus,
    refetch,
  } = useQuery<CoinListResult>(FETCH_COIN_LIST, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [verifyCoinReceipt] = useMutation(VERIFY_COIN_RECEIPT);

  const onFetchProducts = useCallback((products: Product[]) => {
    if (!data || !data.coins) {
      return;
    }

    const productIds = products.map(p => p.productId);
    setCoins(data.coins.filter(c => productIds.includes(c.id)));
  }, [data && data.coins]);

  const onPurchase = useCallback((result: Purchase) => {
    verifyCoinReceipt({
      variables: {
        platform: Platform.select({
          ios: 'apple',
          android: 'google',
        }),
        productId: result.productId,
        receipt: Platform.select({
          ios: result.receipt,
          android: result.purchaseToken,
        }),
      },
    })
    .then(() => InAppPurchase.finalize(result))
    .then(() => Alert.alert('알림', '코인 구매를 완료했습니다'));
  }, []);

  const purchase = useCallback((productId: string) => {
    setIsLoading(true);
    InAppPurchase.purchase(productId);
  }, []);

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

    InAppPurchase.onFetchProducts(onFetchProducts);
    InAppPurchase.onPurchase(onPurchase);
    InAppPurchase.onError(e => Alert.alert('오류', e.message));

    return InAppPurchase.clear;
  }, [data && data.coins]);

  return {
    coins,
    error,
    networkStatus,
    refetch,
    purchase,
  };
}

export default useCoin;
