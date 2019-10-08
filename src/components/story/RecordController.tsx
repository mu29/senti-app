import React, {
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
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
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const RESET_ICON = { uri: 'ic_replay' };
const PLAY_ICON = { uri: 'ic_play_active' };
const DONE_ICON = { uri: 'ic_check' };

interface Props {
  isRecorded: boolean;
  isStarted: boolean;
  isLoading: boolean;
  toggle: () => void;
  release: () => void;
  create: () => void;
}

const RecordController: React.FunctionComponent<Props> = ({
  isRecorded,
  isStarted,
  isLoading,
  toggle,
  release,
  create,
}) => {
  const labelAnimation = useAnimation({
    type: 'timing',
    toValue: Number(!isStarted),
    duration: 200,
    useNativeDriver: true,
  });

  const buttonAnimation = useAnimation({
    type: 'timing',
    toValue: Number(isRecorded),
    duration: 200,
    useNativeDriver: true,
  });

  const progressAnimation = useRef(new Animated.Value(0));

  const playButtonStyle = useMemo(() => ({
    opacity: buttonAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.01, 1],
      extrapolate: 'clamp',
    }),
    transform: [{
      scale: buttonAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.01, 1],
        extrapolate: 'clamp',
      }),
    }],
  }), [buttonAnimation]);

  const recordButtonStyle = useMemo(() => ({
    opacity: buttonAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.01],
      extrapolate: 'clamp',
    }),
    transform: [{
      scale: buttonAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.01],
        extrapolate: 'clamp',
      }),
    }],
  }), [buttonAnimation]);

  const labelStyle = useMemo(() => ({ opacity: labelAnimation }), [labelAnimation]);

  const progressStyle = useMemo(() => ({
    transform: [{ scale: progressAnimation.current }],
  }), []);

  const onPressReset = useCallback(() => {
    release();
    AnalyticsService.logEvent('click_record_reset');
  }, [release]);

  const onPressCreate = useCallback(() => {
    create();
    AnalyticsService.logEvent('click_record_upload');
  }, [create]);

  useEffect(() => {
    if (!isStarted) {
      Animated.timing(progressAnimation.current, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnimation.current, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnimation.current, {
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
  }, [release]);

  return (
    <View style={styles.container}>
      <View style={styles.controller}>
        <Button
          onPress={onPressReset}
          disabled={isStarted}
          style={styles.button}
          round
        >
          <Animated.Image source={RESET_ICON} style={[styles.icon, playButtonStyle]} />
        </Button>
        <View style={styles.recordContainer}>
          <Animated.View style={[styles.progress, progressStyle]} />
          <AnimatedTouchable
            activeOpacity={0.8}
            disabled={isLoading}
            onPress={toggle}
            style={[styles.record, recordButtonStyle]}
          >
            {isLoading && <ActivityIndicator color={palette.transparent.white[80]} size="small" />}
          </AnimatedTouchable>
          <AnimatedTouchable
            activeOpacity={0.8}
            disabled={isLoading}
            onPress={toggle}
            style={[styles.play, playButtonStyle]}
          >
            <Image source={PLAY_ICON} style={styles.playIcon} />
          </AnimatedTouchable>
        </View>
        <Button
          onPress={onPressCreate}
          disabled={isStarted}
          style={styles.button}
          round
        >
          <Animated.Image source={DONE_ICON} style={[styles.icon, playButtonStyle]} />
        </Button>
      </View>
      <View style={styles.hintArea}>
        <AnimatedText style={[typography.heading4, styles.hint, recordButtonStyle, labelStyle]}>
          {LocalizedStrings.RECORDER_RECORD_BUTTON}
        </AnimatedText>
        <AnimatedText style={[typography.heading4, styles.hint, playButtonStyle, labelStyle]}>
          {LocalizedStrings.RECORDER_PLAY_BUTTON}
        </AnimatedText>
      </View>
    </View>
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
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.000001)',
  },
  hintArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  hint: {
    position: 'absolute',
    color: palette.white.default,
  },
  recordContainer: {
    width: 94,
    height: 94,
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 29,
    backgroundColor: palette.red.default,
  },
  play: {
    position: 'absolute',
    width: 58,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 29,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  playIcon: {
    width: 24,
    height: 24,
    marginLeft: 2,
    tintColor: palette.red.default,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: palette.gray[10],
  },
});

export default React.memo(RecordController);
