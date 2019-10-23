import React from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import Carousel, { getInputRangeFromIndexes, CarouselProps } from 'react-native-snap-carousel';
import {
  LoadingBar,
  NewStoryItem,
} from 'components';
import { palette } from 'constants/style';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'always',
  bottom: 'always'
};

interface Props {
  items: Story[];
  initialIndex?: number;
  isLoading: boolean;
  onFetchMore: () => void;
}

class StoryList extends React.PureComponent<Props> {
  public render() {
    const {
      items,
      initialIndex,
      isLoading,
      onFetchMore,
    } = this.props;

    return (
      <Carousel
        layout="stack"
        data={items}
        renderItem={this.renderItem}
        sliderHeight={deviceHeight}
        itemHeight={deviceHeight}
        inactiveSlideScale={1.0}
        inactiveSlideOpacity={0.99}
        containerCustomStyle={styles.container}
        scrollInterpolator={this.scrollInterpolator}
        slideInterpolatedStyle={this.animatedStyles}
        bounces={false}
        scrollEnabled
        vertical
      />
    );
  }

  scrollInterpolator(index: number, carouselProps: CarouselProps<any>) {
    const range = [3, 2, 1, 0, -1, -2];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return { inputRange, outputRange };
  }

  animatedStyles(index: number, animatedValue: Animated.Value, carouselProps: CarouselProps<any>): any {
    const size = carouselProps.itemHeight!;

    return {
      zIndex: carouselProps.data.length - index,
      opacity: animatedValue.interpolate({
          inputRange: [2, 3],
          outputRange: [1, 0],
          extrapolate: 'clamp'
      }),
      transform: [{
        scale: animatedValue.interpolate({
          inputRange: [-2, -1, 0, 1, 2, 3],
          outputRange: [1, 1, 1, 0.98, 0.96, 0.94],
          extrapolate: 'clamp'
        }),
      }, {
        translateY: animatedValue.interpolate({
          inputRange: [-2, -1, 0, 1, 2, 3],
          outputRange: [0, 0, 0, -size / 0.98, -size / 0.96 * 2, -size / 0.94 * 3],
          extrapolate: 'clamp',
        }),
      }],
    };
  }

  private renderItem = ({ item }: { item: Story }) => (
    <NewStoryItem item={item} />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.black.default
  },
  contentContainer: {},
  loading: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  bottomSpace: {
    bottom: 50
  }
});

export default StoryList;
