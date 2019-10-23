import React, {
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { NewStoryItem } from 'components';
import { NewStoryController } from 'containers';
import { palette } from 'constants/style';

const {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

interface Props {
  items: Story[];
  initialIndex?: number;
  isLoading: boolean;
  onFetchMore: () => void;
}

const StoryList: React.FunctionComponent<Props> = ({
  items,
  initialIndex,
  isLoading,
  onFetchMore,
}) => {
  const listRef = useRef<FlatList<Story>>(null);

  const [index, setIndex] = useState(0);

  const renderItem = useCallback(({ item }: { item: Story }) => (
    <NewStoryItem item={item} />
  ), []);

  const keyExtractor = useCallback((item: Story) => item.id, []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: deviceWidth,
    offset: deviceWidth * index,
    index,
  }), []);

  const showNextStory = useCallback(() => {
    listRef.current && listRef.current.scrollToIndex({
      index: index + 1,
    });
  }, [index]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      const nextIndex = viewableItems[0].index;
      if (typeof nextIndex === 'number') {
        setIndex(nextIndex);
      }
    }
  }, [setIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialIndex}
        onEndReached={onFetchMore}
        onViewableItemsChanged={onViewableItemsChanged}
        onEndReachedThreshold={0.5}
        scrollEnabled
        pagingEnabled
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
      <NewStoryController item={items[index]} showNextStory={showNextStory} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 88,
    backgroundColor: palette.black.default,
  },
});

export default StoryList;
