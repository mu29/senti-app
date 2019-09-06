import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import { CoinHistoryItem } from 'components';
import { palette } from 'constants/style';

interface Props {
  items: CoinHistory[];
}

const CoinHistoryList: React.FunctionComponent<Props> = ({
  items,
}) => {
  const renderSeparator = useCallback(() => (
    <View style={styles.separator} />
  ), []);

  const renderItem = useCallback(({ item }: { item: CoinHistory }) => (
    <CoinHistoryItem item={item} />
  ), []);

  const keyExtractor = (item: CoinHistory) => `coin-${item.id}`;

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={renderSeparator}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
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
  separator: {
    height: 1,
    backgroundColor: palette.gray[90],
    marginHorizontal: 16,
  },
});

export default React.memo(CoinHistoryList);
