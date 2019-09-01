import React, {
  useCallback,
} from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import { LoadingBar } from 'components';
import { MessageItem } from 'containers';

interface Props {
  items: Message[];
  isLoading: boolean;
  isRefreshing: boolean;
  onFetchMore: () => void;
  onRefresh: () => void;
}

const MessageList: React.FunctionComponent<Props> = ({
  items,
  isLoading,
  isRefreshing,
  onFetchMore,
  onRefresh,
}) => {
  const renderItem = useCallback(({ item }: { item: Message }) => (
    <MessageItem item={item} />
  ), []);

  const keyExtractor = useCallback((item: Message) => `message-${item.id}`, []);

  return (
    <React.Fragment>
      {isLoading && <LoadingBar />}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onFetchMore}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        inverted
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 8,
  },
});

export default React.memo(MessageList);
