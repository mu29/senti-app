import React from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

interface StoryItemProps {
  item: Story;
  index: number;
  animatedValue: Animated.Value;
}

class StoryItem extends React.PureComponent<StoryItemProps> {
  getParallaxStyles(i: number) {
    return {
      transform: [
        {
          translateY: this.props.animatedValue!.interpolate({
            inputRange: [
              (i - 1) * deviceHeight,
              i * deviceHeight,
              (i + 1) * deviceHeight,
            ],
            outputRange: [-deviceHeight * 0.5, 0, deviceHeight * 0.5],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  }

  render() {
    const {
      index,
      item,
    } = this.props;

    return (
      <View style={styles.container}>
        <Animated.View style={this.getParallaxStyles(index)}>
          <Image
            source={{ uri: item.cover }}
            style={styles.background}
          />
        </Animated.View>
        <View pointerEvents="box-none" style={styles.filter} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
  },
  background: {
    width: deviceWidth,
    height: deviceHeight,
    backgroundColor: '#1A1A1A',
  },
  filter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
});

export default StoryItem;
