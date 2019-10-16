import React, {
  useMemo,
  useCallback,
} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import {
  Text,
  CoinItem,
  RestoreButton,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { LocalizedStrings } from 'constants/translations';

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
  const Header = useMemo(() => (
    <View style={styles.header}>
      <Text style={styles.description}>
        {LocalizedStrings.COIN_DESCRIPTION}
      </Text>
    </View>
  ), []);

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
      ListHeaderComponent={Header}
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
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  description: {
    ...typography.body2,
    textAlign: 'center',
  },
});

export default React.memo(CoinList);
