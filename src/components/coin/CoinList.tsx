import React, { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  CoinItem,
  RestoreButton,
} from 'components';
import { palette } from 'constants/style';

interface Props {
  items: Coin[];
  purchase: (productId: string) => void;
  restore: () => void;
}

const CoinList: React.FunctionComponent<Props> = ({
  items,
  purchase,
  restore,
}) => {
  const renderItem = useCallback(({ item }: { item: Coin }) => (
    <CoinItem item={item} purchase={purchase} />
  ), [purchase]);

  const keyExtractor = (item: Coin) => `coin-${item.id}`;

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ListFooterComponent={<RestoreButton restore={restore} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.gray[100],
  },
  contentContainer: {
    paddingVertical: 6,
  },
});

export default React.memo(CoinList);
