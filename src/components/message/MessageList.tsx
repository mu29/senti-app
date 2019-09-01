import React, {
  useCallback,
} from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import { LoadingIndicator } from 'components';
import { MessageItem } from 'containers';

interface Props {
  items: Message[];
  isLoading: boolean;
  onFetchMore: () => void;
}

const MessageList: React.FunctionComponent<Props> = ({
  items,
  isLoading,
  onFetchMore,
}) => {
  const renderItem = useCallback(({ item }: { item: Message }) => (
    <MessageItem item={item} />
  ), []);

  const keyExtractor = useCallback((item: Message) => `message-${item.id}`, []);

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onFetchMore}
      contentContainerStyle={styles.container}
      ListFooterComponent={isLoading ? <LoadingIndicator /> : null}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      inverted
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
  },
});

export default MessageList;
