import React, { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import {
  LoadingBar,
  ChattingItem,
} from 'components';

const SAFE_AREA_INSET: {
  bottom: SafeAreaViewForceInsetValue;
} = {
  bottom: 'always',
};

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
    <React.Fragment>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onFetchMore}
        onEndReachedThreshold={1}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
      <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.loading}>
        <LoadingBar isVisible={isLoading} />
      </SafeAreaView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 50,
  },
  loading: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
});

export default React.memo(ChattingList);
