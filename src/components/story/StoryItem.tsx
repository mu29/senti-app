import React from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Text } from 'components';
import { palette } from 'constants/style';

const {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

interface StoryItemProps {
  story: Story;
  index: number;
  animatedValue: Animated.Value;
}

class StoryItem extends React.PureComponent<StoryItemProps> {
  public render() {
    const {
      index,
      story,
    } = this.props;

    if (!story) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Animated.View style={this.getParallaxStyles(index)}>
          <Image
            source={{ uri: story.cover }}
            style={styles.background}
          />
        </Animated.View>
        <View pointerEvents="box-none" style={styles.filter}>
          <Text style={styles.description}>
            {story.description.replace(/#[^ ]+/g, '').trim()}
          </Text>
        </View>
      </View>
    );
  }

  private getParallaxStyles(index: number) {
    return {
      transform: [
        {
          translateY: this.props.animatedValue!.interpolate({
            inputRange: [
              (index - 1) * deviceHeight,
              index * deviceHeight,
              (index + 1) * deviceHeight,
            ],
            outputRange: [-deviceHeight * 0.5, 0, deviceHeight * 0.5],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
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
    backgroundColor: palette.gray[100],
  },
  filter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.transparent.black[40],
  },
  description: {
    color: palette.white.default,
    fontSize: 18,
  },
});

export default StoryItem;
