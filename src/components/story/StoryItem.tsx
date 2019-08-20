import React, {
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useAnimation } from 'react-native-animation-hooks';
import { SafeAreaView } from 'react-navigation';
import imageCacheHoc from 'react-native-image-cache-hoc';
import {
  Text,
  StoryController,
} from 'components';
import { useAudio } from 'services';
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

interface Props {
  item: Story;
  index: number;
  animatedValue: Animated.Value;
  hasBottom?: boolean;
}

const StoryItem: React.FunctionComponent<Props> = ({
  item,
  index,
  animatedValue,
  hasBottom,
}) => {
  const {
    audio,
    play,
    pause,
  } = useAudio(item.audio.url);

  const coverImage = useMemo(() => ({ uri: item.cover }), [item]);

  const parallexStyle = useMemo(() => ({
    transform: [{
      translateY: animatedValue!.interpolate({
        inputRange: [
          (index - 1) * deviceHeight,
          index * deviceHeight,
          (index + 1) * deviceHeight,
        ],
        outputRange: [-deviceHeight * 0.5, 0, deviceHeight * 0.5],
        extrapolate: 'clamp',
      }),
    }],
  }), [index]);

  const pauseAnimation = useAnimation({
    type: 'timing',
    toValue: Number(!audio.isPlaying),
    duration: 200,
    useNativeDriver: true,
  });

  const toggle = useCallback(() => {
    audio.isPlaying ? pause() : play(item.audio.url);
  }, [item, audio.isPlaying]);

  const renderTag = useCallback((tag: string, i: number) => (
    <Text key={`${tag}-${i}`} style={styles.tag}>
      {tag}
    </Text>
  ), []);

  const iconStyle = useMemo(() => ({ opacity: pauseAnimation }), [pauseAnimation]);

  return (
    <View style={styles.container}>
      <Animated.View style={parallexStyle}>
        <CachableImage
          source={coverImage}
          style={styles.background}
          permanent
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
              {item.description.replace(/#[^ ]+/g, '').trim()}
            </Text>
            <View style={styles.tags}>
              {item.tags.map(tag => `#${tag}`).map(renderTag)}
            </View>
          </TouchableOpacity>
          <StoryController item={item} style={hasBottom && styles.controller} />
          <Animated.View pointerEvents="none" style={[styles.iconContainer, iconStyle]}>
            <Image source={PLAY_ICON} style={styles.icon} />
          </Animated.View>
        </SafeAreaView>
      </View>
    </View>
  );
};

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
    textAlign: 'center',
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

export default React.memo(StoryItem);
