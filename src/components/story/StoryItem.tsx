import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
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
import {
  AudioState,
  StoryState,
} from 'stores/states';
import {
  pauseAudioAction,
  playAudioAction,
} from 'stores/actions';
import { palette } from 'constants/style';
import { LoadingType } from 'constants/enums';

const {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

const PLAY_ICON = { uri: 'ic_play_active' };

interface StoryItemProps {
  storyId: string;
  index: number;
  animatedValue: Animated.Value;
  audioState?: AudioState;
  storyState?: StoryState;
}

@inject('audioState', 'storyState')
@observer
class StoryItem extends React.Component<StoryItemProps> {
  private pauseAnimation = new Animated.Value(0);

  private iconStyle = { opacity: this.pauseAnimation };

  private animationReactionDisposer?: IReactionDisposer;

  public componentDidMount() {
    this.animationReactionDisposer = autorun(() => {
      Animated.timing(this.pauseAnimation, {
        toValue: Number(!this.audio.isPlaying && this.props.audioState!.isLoading === LoadingType.NONE),
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
    if (!this.story) {
      return null;
    }

    const { index } = this.props;

    return (
      <View style={styles.container}>
        <Animated.View style={this.getParallaxStyles(index)}>
          <Image
            source={{ uri: this.story.cover }}
            style={styles.background}
          />
        </Animated.View>
        <View style={styles.filter}>
          <SafeAreaView style={styles.content}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.toggle}
              style={styles.button}
            >
              <Text style={styles.description}>
                {this.story.description.replace(/#[^ ]+/g, '').trim()}
              </Text>
              <View style={styles.tags}>
                {Object.keys(this.story.tags).map(tag => `#${tag}`).reverse().map(this.renderTag)}
              </View>
            </TouchableOpacity>
            <StoryController story={this.story} />
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

  private get story() {
    const {
      storyId,
      storyState,
    } = this.props;

    return storyState!.stories[storyId] || {};
  }

  private get audio() {
    const { audioState } = this.props;

    return audioState!.audios[this.story.audio.id] || {};
  }

  private renderTag = (tag: string, index: number) => (
    <Text key={`${tag}-${index}`} style={styles.tag}>
      {tag}
    </Text>
  )

  private toggle = () => {
    if (this.audio.isPlaying) {
      pauseAudioAction();
    } else {
      playAudioAction(this.audio);
    }
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
  },
  description: {
    marginTop: 32,
    color: palette.gray[10],
    fontSize: 18,
  },
  tags: {
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 64,
  },
  tag: {
    margin: 4,
    color: palette.gray[30],
    fontSize: 16,
    fontWeight: '600',
  },
  iconContainer: {
    position: 'absolute',
    paddingBottom: 112,
  },
  icon: {
    width: 48,
    height: 48,
    tintColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default StoryItem;
