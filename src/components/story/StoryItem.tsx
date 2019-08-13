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
import imageCacheHoc from 'react-native-image-cache-hoc';
import {
  Text,
  StoryController,
} from 'components';
import {
  withAudio,
  AudioItemProps,
} from 'services';
import { palette } from 'constants/style';

const {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

const PLAY_ICON = { uri: 'ic_play_active' };

const CachableImage = imageCacheHoc(Image, {
  fileDirName: 'covers',
  cachePruneTriggerLimit: 1024 * 1024 * 50,
});

interface Props extends AudioItemProps {
  item: Story;
  index: number;
  animatedValue: Animated.Value;
  hasBottom?: boolean;
}

class StoryItem extends React.Component<Props> {
  private pauseAnimation = new Animated.Value(0);

  private iconStyle = { opacity: this.pauseAnimation };

  private coverImage = { uri: this.props.item.cover };

  public componentDidUpdate(prevProps: Props) {
    const wasPlaying = prevProps.audio && prevProps.audio.isPlaying;
    const isPlaying = this.props.audio && this.props.audio.isPlaying;

    if (wasPlaying !== isPlaying) {
      Animated.timing(this.pauseAnimation, {
        toValue: Number(!(this.props.audio && this.props.audio.isPlaying)),
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }

  public render() {
    const {
      item,
      index,
      hasBottom,
    } = this.props;

    return (
      <View style={styles.container}>
        <Animated.View style={this.getParallaxStyles(index)}>
          <CachableImage
            source={this.coverImage}
            style={styles.background}
            permanent
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
                {item.description.replace(/#[^ ]+/g, '').trim()}
              </Text>
              <View style={styles.tags}>
                {item.tags.map(tag => `#${tag}`).map(this.renderTag)}
              </View>
            </TouchableOpacity>
            <StoryController item={item} style={hasBottom && styles.controller} />
            <Animated.View pointerEvents="none" style={[styles.iconContainer, this.iconStyle]}>
              <Image source={PLAY_ICON} style={styles.icon} />
            </Animated.View>
          </SafeAreaView>
        </View>
      </View>
    );
  }

  private renderTag = (tag: string, index: number) => (
    <Text key={`${tag}-${index}`} style={styles.tag}>
      {tag}
    </Text>
  )

  private toggle = () => {
    const {
      audio,
      play,
      pause,
    } = this.props;

    if (!audio) {
      return;
    }

    if (audio.isPlaying) {
      pause();
    } else {
      play(audio.url);
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 64,
  },
  tag: {
    marginHorizontal: 4,
    marginVertical: 2,
    color: palette.gray[30],
    fontSize: 16,
    fontWeight: '600',
  },
  controller: {
    marginBottom: 48,
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

export default withAudio(StoryItem, props => props.item.audio.url);
