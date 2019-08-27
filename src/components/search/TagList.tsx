import React, {
  useEffect,
  useCallback,
} from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import { LoadingIndicator } from 'components';
import { TagItem } from 'containers';

interface Props {
  items: Tag[];
  isLoading: boolean;
  fetchPopularTags: () => void;
}

const TagList: React.FunctionComponent<Props> = ({
  items,
  isLoading,
  fetchPopularTags,
}) => {
  useEffect(() => {
    fetchPopularTags();
  }, []);

  const renderItem = useCallback(({ item }: { item: Tag }) => (
    <TagItem item={item} />
  ), []);

  const keyExtractor = useCallback((item: Tag) => `tag-${item.id}`, []);

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      ListFooterComponent={isLoading ? <LoadingIndicator /> : null}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
});

export default TagList;
