import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Platform,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import ViewPagerAndroid, {
  ViewPagerAndroidOnPageSelectedEventData,
} from '@react-native-community/viewpager';

const { width: deviceWidth } = Dimensions.get('window');

interface Props {
  children: React.ReactNode | React.ReactNodeArray;
  onPageSelected?: (index: number) => void;
}

class ViewPager extends React.PureComponent<Props> {
  private pagerRef = React.createRef<any>();

  public setPage = (index: number, options: { animated: boolean } = { animated: true }) => {
    if (!this.pagerRef.current) {
      return;
    }

    if (Platform.OS === 'ios') {
      this.pagerRef.current.scrollToIndex({
        index,
        animated: options.animated,
      });
      return;
    }

    if (options.animated) {
      this.pagerRef.current.setPage(index);
    } else {
      this.pagerRef.current.setPageWithoutAnimation(index);
    }
  }

  public render() {
    return Platform.OS === 'android' ? (
      <ViewPagerAndroid
        ref={this.pagerRef}
        onPageSelected={this.onPageSelected}
      >
        {this.pages.map(this.wrappedByView)}
      </ViewPagerAndroid>
    ) : (
      <FlatList
        ref={this.pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={this.pages}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onMomentumScrollEnd={this.onScrollEnd}
      />
    );
  }

  private get pages(): React.ReactNodeArray {
    const { children } = this.props;

    return Array.isArray(children) ? children : [children];
  }

  private onPageSelected = (event: NativeSyntheticEvent<ViewPagerAndroidOnPageSelectedEventData>) => {
    const { onPageSelected } = this.props;
    const { position } = event.nativeEvent;

    if (onPageSelected) {
      onPageSelected(position);
    }
  }

  private onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { onPageSelected } = this.props;
    const { contentOffset } = event.nativeEvent;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const index = Math.floor(contentOffset.x / viewSize.width);

    if (onPageSelected) {
      onPageSelected(index);
    }
  }

  private wrappedByView = (component: React.ReactNode, index: number) => (
    <View key={index} style={styles.page}>
      {component}
    </View>
  )

  private keyExtractor = (_: any, index: number) => `${index}`;

  private renderItem = ({
    item,
    index,
  }: {
    item: React.ReactNode;
    index: number;
  }) => this.wrappedByView(item, index)
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: deviceWidth,
  },
});

export default ViewPager;
