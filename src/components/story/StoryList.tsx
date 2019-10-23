import React, {
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  FlatList,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import {
  LoadingBar,
  StoryItem,
} from 'components';
import { StoryController } from 'containers';
import { AudioService } from 'services';
import { palette } from 'constants/style';

const {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 100 };

const SAFE_AREA_INSET: {
  bottom: SafeAreaViewForceInsetValue;
} = {
  bottom: 'always',
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface Props {
  items: Story[];
  initialIndex?: number;
  isLoading: boolean;
  isRefreshing: boolean;
  hasBottom?: boolean;
  onFetchMore: () => void;
  onRefresh: () => void;
}

const StoryList: React.FunctionComponent<Props> = ({
  items,
  initialIndex,
  isLoading,
  isRefreshing,
  hasBottom,
  onFetchMore,
  onRefresh,
}) => {
  const swiperAnimation = useRef(new Animated.Value(0));

  const listRef = useRef<AnimatedFlatList>(null);

  const [index, setIndex] = useState(initialIndex || 0);

  const renderItem = useCallback(({ item, index }: { item: Story; index: number }) => (
    <StoryItem
      item={item}
      index={index}
      animatedValue={swiperAnimation.current}
    />
  ), []);

  const keyExtractor = useCallback((item: Story) => item.id, []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: deviceHeight,
    offset: deviceHeight * index,
    index,
  }), []);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setIndex(viewableItems[0].index);
      AudioService.stop();
    }
  }, [setIndex]);

  const onPressNext = useCallback(() => {
    console.log(index, items.length)
    if (index + 1 < items.length && listRef.current) {
      listRef.current.getNode().scrollToIndex({
        index: index + 1,
      });
    }
  }, [index]);

  return (
    <React.Fragment>
      <AnimatedFlatList
        ref={listRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialIndex}
        onEndReached={onFetchMore}
        onEndReachedThreshold={1}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: swiperAnimation.current } } }],
          { useNativeDriver: true },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        style={styles.container}
        scrollEnabled
        pagingEnabled
        horizontal={false}
        scrollEventThrottle={10}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
      {hasBottom ? (
        <SafeAreaView forceInset={SAFE_AREA_INSET} style={[styles.loading, styles.bottomSpace]}>
          <LoadingBar isVisible={isLoading} />
        </SafeAreaView>
      ) : (
        <View style={styles.loading}>
          <LoadingBar isVisible={isLoading} />
        </View>
      )}
      <StoryController item={items[index]} onPressNext={onPressNext} hasBottom={hasBottom} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    height: deviceHeight,
    backgroundColor: palette.black.default,
  },
  loading: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomSpace: {
    bottom: 50,
  },
});

export default StoryList;
