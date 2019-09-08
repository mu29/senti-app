import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  LoadingBar,
  TransactionItem,
} from 'components';
import { palette } from 'constants/style';

interface Props {
  items: Transaction[];
  isLoading: boolean;
  isRefreshing: boolean;
  onFetchMore: () => void;
  onRefresh: () => void;
}

const TransactionList: React.FunctionComponent<Props> = ({
  items,
  isLoading,
  isRefreshing,
  onFetchMore,
  onRefresh,
}) => {
  const renderSeparator = useCallback(() => (
    <View style={styles.separator} />
  ), []);

  const renderItem = useCallback(({ item }: { item: Transaction }) => (
    <TransactionItem item={item} />
  ), []);

  const keyExtractor = (item: Transaction) => `coin-${item.id}`;

  return (
    <React.Fragment>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onFetchMore}
        onEndReachedThreshold={1}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      />
      <View style={styles.loading}>
        <LoadingBar isVisible={isLoading} />
      </View>
    </React.Fragment>
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
  loading: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default React.memo(TransactionList);
