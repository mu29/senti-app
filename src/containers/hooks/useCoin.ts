import {
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Alert,
  Platform,
} from 'react-native';
import uniqBy from 'lodash/uniqBy';
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
  VERIFY_RECEIPT,
  FETCH_TRANSACTION_FEED,
} from 'graphqls';
import { LocalizedStrings } from 'constants/translations';

type CoinListResult = {
  coins: Coin[];
};

type TransactionFeedResult = {
  transactionFeed: {
    transactions: Transaction[];
    cursor: string;
  };
};

function useCoin(setIsLoading: (isLoading: boolean) => void) {
  const [availableCoins, setAvailableCoins] = useState<Coin[]>([]);

  const {
    data: {
      coins,
    } = {
      coins: undefined,
    },
    error,
    networkStatus,
    refetch,
  } = useQuery<CoinListResult>(FETCH_COIN_LIST, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [verifyReceipt] = useMutation(VERIFY_RECEIPT, {
    update: (cache, { data: { verifyReceipt: transaction } }) => {
      try {
        const data = cache.readQuery<TransactionFeedResult>({
          query: FETCH_TRANSACTION_FEED,
        });

        if (!data) {
          return;
        }

        cache.writeQuery({
          query: FETCH_TRANSACTION_FEED,
          data: {
            transactionFeed: {
              ...data.transactionFeed,
              transactions: uniqBy([transaction, ...data.transactionFeed.transactions], 'id'),
            },
          },
        });

      } catch {}
    },
  });

  const onFetchProducts = useCallback((products: Product[]) => {
    if (!coins) {
      return;
    }

    const productIds = products.map(p => p.productId);

    setAvailableCoins(coins.filter(c => productIds.includes(c.id)));
  }, [coins, setAvailableCoins]);

  const onPurchase = useCallback((result: Purchase) => {
    return verifyReceipt({
      variables: {
        input: {
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
      },
    })
    .then(() => InAppPurchase.finalize(result, true))
    .then(() => Alert.alert(LocalizedStrings.COIN_PURCHASE_SUCCESS_TITLE, LocalizedStrings.COIN_PURCHASE_SUCCESS_MESSAGE))
    .catch(e => Alert.alert(LocalizedStrings.COMMON_ERROR, e.message))
    .finally(() => setIsLoading(false));
  }, [setIsLoading, verifyReceipt]);

  const purchase = useCallback((productId: string) => {
    setIsLoading(true);
    InAppPurchase.purchase(productId);
  }, [setIsLoading]);

  const restore = useCallback(() => {
    setIsLoading(true);
    InAppPurchase.flush()
      .then(purchases => {
        if (purchases.length === 0) {
          return;
        }

        Alert.alert(LocalizedStrings.COMMON_NOTICE, LocalizedStrings.COIN_RESTORE_MESSAGE);

        return Promise.all(purchases.map(p => onPurchase(p)));
      })
      .finally(() => setIsLoading(false));
  }, [setIsLoading, onPurchase]);

  useEffect(() => {
    InAppPurchase.onFetchProducts(onFetchProducts);
    InAppPurchase.onPurchase(onPurchase);
    InAppPurchase.onError(e => {
      Alert.alert(LocalizedStrings.COMMON_ERROR, e.message);
      setIsLoading(false);
    });

    return () => InAppPurchase.clear();
  }, [onFetchProducts, onPurchase, setIsLoading]);

  useEffect(() => {
    if (!coins) {
      return;
    }

    InAppPurchase.configure().then(() => InAppPurchase.fetchProducts(coins.map(c => c.id)));
  }, [coins, onFetchProducts]);

  return {
    coins: availableCoins,
    error,
    networkStatus,
    refetch,
    purchase,
    restore,
  };
}

export default useCoin;
