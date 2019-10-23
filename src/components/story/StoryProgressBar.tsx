import React, { useMemo } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useAnimation } from 'react-native-animation-hooks';
import { Text } from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { toTimeText } from 'utils';

const {
  width: windowWidth,
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
    toValue: audio.isPlaying ? 1 : audio.elapsedTime / duration,
    initialValue: audio.elapsedTime / duration,
    duration: audio.isPlaying ? duration : 400,
    useNativeDriver: true,
  });

  const progressStyle = useMemo(() => ([styles.innerBar, {
    transform: [{
      translateX: progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-windowWidth + 4, 0],
        extrapolate: 'clamp',
      }),
    }],
  }]), [progressAnimation]);

  return (
    <View style={styles.outerBar}>
      <Animated.View style={progressStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerBar: {
    height: 3,
    backgroundColor: palette.transparent.black[60],
    borderRadius: 2,
    overflow: 'hidden',
  },
  innerBar: {
    backgroundColor: palette.yellow.default,
    height: 3,
    borderRadius: 2,
  },
});

export default StoryProgressBar;
