import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  FlatList,
  Animated,
  StyleSheet,
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
import {
  AudioService,
  LayoutService,
} from 'services';
import { palette } from 'constants/style';

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 90 };

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

  const listRef = useRef<typeof AnimatedFlatList>(null);

  const [current, setCurrent] = useState(initialIndex || 0);

  const containerStyle = useMemo(() => ({
    width: LayoutService.screenWidth,
    height: LayoutService.screenHeight,
    backgroundColor: palette.black.default,
  }), []);

  const renderItem = useCallback(({ item, index }: { item: Story; index: number }) => (
    <StoryItem
      item={item}
      index={index}
      animatedValue={swiperAnimation.current}
    />
  ), []);

  const keyExtractor = useCallback((item: Story) => item.id, []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: LayoutService.screenHeight,
    offset: LayoutService.screenHeight * index,
    index,
  }), []);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setCurrent(viewableItems[0].index);
      AudioService.stop();
    }
  }, [setCurrent]);

  const onPressNext = useCallback(() => {
    if (current + 1 < items.length && listRef.current) {
      listRef.current.getNode().scrollToIndex({
        index: current + 1,
      });
    }
  }, [current, items.length]);

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
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: swiperAnimation.current } } }],
          { useNativeDriver: true },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        style={containerStyle}
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
      <StoryController item={items[current]} onPressNext={onPressNext} hasBottom={hasBottom} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
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
