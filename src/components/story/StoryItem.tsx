import React from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Text } from 'components';
import { palette } from 'services/style';

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

    return (
      <View style={styles.container}>
        <Animated.View style={this.getParallaxStyles(index)}>
          <Image
            source={{ uri: story.cover }}
            style={styles.background}
          />
        </Animated.View>
        <View pointerEvents="box-none" style={styles.filter}>
          <View style={styles.descriptions}>
            {story.description.split(' ').map((word, i) => (
              <Text key={i} style={[styles.description, word.startsWith('#') && styles.tag]}>
                {word}
              </Text>
            ))}
          </View>
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
    backgroundColor: '#1A1A1A',
  },
  filter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  descriptions: {
    flexDirection: 'row',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    marginHorizontal: 2,
    color: palette.white.default,
    fontSize: 18,
  },
  tag: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StoryItem;
