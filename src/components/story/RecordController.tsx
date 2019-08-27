import React, {
  useMemo,
  useEffect,
} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useAnimation } from 'react-native-animation-hooks';
import {
  Text,
  Button,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';

const AnimatedText = Animated.createAnimatedComponent(Text);

const RESET_ICON = { uri: 'ic_replay' };
const DONE_ICON = { uri: 'ic_check' };

interface Props {
  isLoading: boolean;
  isStarted: boolean;
  isRecorded: boolean;
  toggle: () => void;
  release: () => void;
  create: () => void;
}

const RecordController: React.FunctionComponent<Props> = ({
  isLoading,
  isStarted,
  isRecorded,
  toggle,
  release,
  create,
}) => {
  const fadeAnimation = useAnimation({
    type: 'timing',
    toValue: Number(!isStarted),
    duration: 200,
    useNativeDriver: true,
  });

  const progressAnimation = useMemo(() => new Animated.Value(0), []);

  const fadeStyle = useMemo(() => ({ opacity: fadeAnimation }), [fadeAnimation]);

  const progressStyle = useMemo(() => ({ transform: [{ scale: progressAnimation }] }), [progressAnimation]);

  useEffect(() => {
    if (!isStarted) {
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnimation, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [isStarted]);

  useEffect(() => {
    release();
    return release();
  }, []);

  return (
    <Animated.View style={styles.container}>
      <View style={styles.controller}>
        <Button
          onPress={release}
          disabled={!isRecorded}
          style={[styles.button, isRecorded && styles.enabled]}
          round
        >
          <Animated.Image source={RESET_ICON} style={[styles.icon, fadeStyle]} />
        </Button>
        <View style={styles.recordContainer}>
          <Animated.View style={[styles.progress, progressStyle]} />
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={toggle}
            style={styles.record}
          />
        </View>
        <Button
          onPress={create}
          disabled={!isRecorded}
          isLoading={isLoading}
          style={[styles.button, isRecorded && styles.enabled]}
          round
        >
          <Animated.Image source={DONE_ICON} style={[styles.icon, fadeStyle]} />
        </Button>
      </View>
      <AnimatedText style={[typography.heading4, styles.hint, fadeStyle]}>
        눌러서 {isRecorded ? '듣기' : '녹음'}
      </AnimatedText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  controller: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  hint: {
    marginTop: 32,
    color: palette.white.default,
  },
  recordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    position: 'absolute',
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 36,
    borderWidth: 5,
    borderColor: palette.transparent.red.default,
  },
  record: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: palette.red.default,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.5,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: palette.gray[10],
  },
  enabled: {
    opacity: 1,
  },
});

export default React.memo(RecordController);
