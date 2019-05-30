import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  autorun,
  IReactionDisposer,
} from 'mobx';
import {
  inject,
  observer,
} from 'mobx-react/native';
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

const PLAY_ICON = { uri: 'ic_play_active' };

interface StoryItemProps {
  story: Story;
  index: number;
  animatedValue: Animated.Value;
  storyStore?: StoryStore;
}

@inject('storyStore')
@observer
class StoryItem extends React.Component<StoryItemProps> {
  private pauseAnimation = new Animated.Value(0);

  private iconStyle = { opacity: this.pauseAnimation };

  private animationReactionDisposer?: IReactionDisposer;

  public componentDidMount() {
    this.animationReactionDisposer = autorun(() => {
      const {
        story,
        storyStore,
      } = this.props;

      Animated.timing(this.pauseAnimation, {
        toValue: Number(storyStore!.paused === story.audio.url),
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }

  public componentWillUnmount() {
    if (this.animationReactionDisposer) {
      this.animationReactionDisposer();
    }
  }

  public render() {
    const {
      index,
      story,
      storyStore,
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
        <View style={styles.filter}>
          <SafeAreaView style={styles.content}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={storyStore!.toggle}
              style={styles.button}
            >
              <Text style={styles.description}>
                {story.description.replace(/#[^ ]+/g, '').trim()}
              </Text>
            </TouchableOpacity>
            <StoryController story={story} />
            <Animated.View pointerEvents="none" style={[styles.iconContainer, this.iconStyle]}>
              <Image
                source={PLAY_ICON}
                style={styles.icon}
              />
            </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingTop: 56,
  },
  description: {
    color: palette.white.default,
    fontSize: 18,
  },
  iconContainer: {
    position: 'absolute',
    paddingBottom: 72,
  },
  icon: {
    width: 48,
    height: 48,
    tintColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default StoryItem;
