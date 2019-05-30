import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { inject } from 'mobx-react/native';
import {
  Text,
  StoryController,
} from 'components';
import { palette } from 'constants/style';
import { SafeAreaView } from 'react-navigation';
import { StoryStore } from 'stores';

const {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

interface StoryItemProps {
  story: Story;
  index: number;
  animatedValue: Animated.Value;
  storyStore?: StoryStore;
}

@inject('storyStore')
class StoryItem extends React.PureComponent<StoryItemProps> {
  public render() {
    const {
      index,
      story,
      storyStore,
    } = this.props;
    const { toggle } = storyStore!;

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
        <View style={styles.filter}>
          <SafeAreaView style={styles.content}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={toggle}
              style={styles.button}
            >
              <Text style={styles.description}>
                {story.description.replace(/#[^ ]+/g, '').trim()}
              </Text>
            </TouchableOpacity>
            <StoryController story={story} />
          </SafeAreaView>
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
    backgroundColor: palette.transparent.black[40],
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    color: palette.white.default,
    fontSize: 18,
  },
});

export default StoryItem;
