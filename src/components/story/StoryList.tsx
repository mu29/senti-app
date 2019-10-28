import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
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
import AsyncStorage from '@react-native-community/async-storage';
import {
  LoadingBar,
  Portal,
  StoryItem,
  TutorialLayer,
} from 'components';
import { StoryController } from 'containers';
import { AudioService } from 'services';
import { palette } from 'constants/style';
import { LocalizedStrings } from 'constants/translations';
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from 'constants/config';

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

  const renderItem = useCallback(({ item, index }: { item: Story; index: number }) => (
    <StoryItem
      item={item}
      index={index}
      animatedValue={swiperAnimation.current}
    />
  ), []);

  const keyExtractor = useCallback((item: Story) => item.id, []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: SCREEN_HEIGHT,
    offset: SCREEN_HEIGHT * index,
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

  useEffect(() => {
    AsyncStorage.getItem('@MainTutorialFinished').then((finished) => {
      if (finished) {
        return;
      }

      AsyncStorage.setItem('@MainTutorialFinished', 'true');
      setTimeout(() => Portal.show(TutorialLayer, {
        title: LocalizedStrings.TUTORIAL_MAIN_TITLE,
        description: LocalizedStrings.TUTORIAL_MAIN_DESCRIPTION,
        steps: [{
          icon: 'ic_play_active',
          message: LocalizedStrings.TUTORIAL_MAIN_STEP_1,
        }, {
          icon: 'ic_next',
          message: LocalizedStrings.TUTORIAL_MAIN_STEP_2,
        }, {
          icon: 'ic_chat_active',
          message: LocalizedStrings.TUTORIAL_MAIN_STEP_3,
        }],
      }), 500);
    });
  }, []);

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
      {items[current] && (
        <StoryController
          item={items[current]}
          onPressNext={onPressNext}
          hasBottom={hasBottom}
        />
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
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
