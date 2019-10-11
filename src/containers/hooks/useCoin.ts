import {
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Alert,
  Platform,
} from 'react-native';
import InAppPurchase, { Purchase } from 'react-native-in-app-purchase';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import {
  FETCH_COIN_LIST,
  VERIFY_COIN_RECEIPT,
  FETCH_PROFILE,
  FETCH_TRANSACTION_FEED,
} from 'graphqls';
import { InAppPurchaseService } from 'services';
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

  const [verifyCoinReceipt] = useMutation(VERIFY_COIN_RECEIPT, {
    update: (cache, { data: { verifyCoinReceipt: transaction } }) => {
      try {
        const savedFeed = cache.readQuery<TransactionFeedResult>({
          query: FETCH_TRANSACTION_FEED,
        });

        const savedProfile = cache.readQuery<{ me: Profile }>({
          query: FETCH_PROFILE,
        });

        if (!savedFeed || !savedProfile) {
          return;
        }

        cache.writeQuery({
          query: FETCH_TRANSACTION_FEED,
          data: {
            transactionFeed: {
              ...savedFeed.transactionFeed,
              transactions: [transaction, ...savedFeed.transactionFeed.transactions],
            },
          },
        });

        cache.writeQuery({
          query: FETCH_PROFILE,
          data: {
            me: {
              ...savedProfile.me,
              coin: (savedProfile.me.coin || 0) + transaction.amount,
            },
          },
        });
      } catch {}
    },
  });

  const onFetchProducts = useCallback((productIds: string[]) => {
    if (!data || !data.coins) {
      return;
    }

    setCoins(data.coins.filter(c => productIds.includes(c.id)));
  }, [data]);

  const onPurchase = useCallback((result: Purchase) => {
    verifyCoinReceipt({
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
    .then(() => InAppPurchase.finalize(result))
    .then(() => Alert.alert(LocalizedStrings.COIN_PURCHASE_SUCCESS_TITLE, LocalizedStrings.COIN_PURCHASE_SUCCESS_MESSAGE))
    .catch(e => Alert.alert(LocalizedStrings.COMMON_ERROR, e.message))
    .finally(() => setIsLoading(false));
  }, [setIsLoading, verifyCoinReceipt]);

  const purchase = useCallback((productId: string) => {
    setIsLoading(true);
    InAppPurchase.purchase(productId);
  }, [setIsLoading]);

  useEffect(() => {
    if (!data || !data.coins) {
      return;
    }

    const productIds = data.coins.map(c => c.id);

    InAppPurchaseService.addObserver(onFetchProducts);
    InAppPurchaseService.configure(productIds);

    return () => InAppPurchaseService.removeObserver(onFetchProducts);
  }, [data, onFetchProducts]);

  useEffect(() => {
    if (!data || !data.coins) {
      return;
    }

    InAppPurchase.onPurchase(onPurchase);
    InAppPurchase.onError(e => Alert.alert(LocalizedStrings.COMMON_ERROR, e.message));

    return InAppPurchase.clear;
  }, [data, onPurchase]);

  return {
    coins,
    error,
    networkStatus,
    refetch,
    purchase,
  };
}

export default useCoin;
