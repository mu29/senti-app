import React, { useMemo } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  Easing,
} from 'react-native';
import { useAnimation } from 'react-native-animation-hooks';
import { Text } from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { toTimeText } from 'utils';

const {
  width: deviceWidth,
} = Dimensions.get('window');

interface Props {
  audio: PlayableAudio;
  duration: number;
}

const StoryProgressBar: React.FunctionComponent<Props> = ({
  audio,
  duration,
}) => {
  const progressAnimation = useAnimation({
    type: 'timing',
    easing: Easing.linear,
    toValue: Number(audio.isPlaying),
    duration: audio.isPlaying ? duration : 250,
    useNativeDriver: true,
  });

  const progressStyle = useMemo(() => ({
    transform: [{
      translateX: progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-(deviceWidth - 52), 0],
        extrapolate: 'clamp',
      }),
    }],
    ...styles.progress,
  }), [progressAnimation]);

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Animated.View style={progressStyle} />
      </View>
      <View style={styles.timer}>
        <Text style={[typography.tiny2, { color: palette.gray[70] }]}>
          {toTimeText(audio.elapsedTime)}
        </Text>
        <Text style={[typography.tiny2, { color: palette.gray[70] }]}>
          {toTimeText(duration)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  bar: {
    height: 3,
    borderRadius: 2,
    backgroundColor: palette.gray[90],
    overflow: 'hidden',
  },
  progress: {
    height: 3,
    borderRadius: 2,
    backgroundColor: palette.yellow.default,
  },
  timer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
});

export default StoryProgressBar;
