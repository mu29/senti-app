import React, { useCallback } from 'react';
import InAppPurchase from 'react-native-in-app-purchase';
import { CoinItem } from 'components';

interface Props {
  item: Coin;
}

const Container: React.FunctionComponent<Props> = ({
  item,
}) => {
  const purchase = useCallback(() => {
    InAppPurchase.purchase(item.id);
  }, [item]);

  return (
    <CoinItem item={item} purchase={purchase} />
  );
};

export default React.memo(Container);
