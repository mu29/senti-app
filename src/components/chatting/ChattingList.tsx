import React, { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  LoadingIndicator,
  ChattingItem,
} from 'components';

interface Props {
  items: Chatting[];
  isLoading: boolean;
  isRefreshing: boolean;
  onFetchMore: () => void;
  onRefresh: () => void;
}

const ChattingList: React.FunctionComponent<Props> = ({
  items,
  isLoading,
  isRefreshing,
  onFetchMore,
  onRefresh,
}) => {
  const renderItem = useCallback(({ item }: { item: Chatting }) => (
    <ChattingItem item={item} />
  ), []);

  const keyExtractor = useCallback((item: Chatting) => `Chatting-${item.id}`, []);

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onFetchMore}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      ListFooterComponent={isLoading ? <LoadingIndicator /> : null}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 50,
  },
});

export default React.memo(ChattingList);
