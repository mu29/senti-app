import React, {
  useMemo,
  useEffect,
  useRef,
  useCallback,
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
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

const AnimatedText = Animated.createAnimatedComponent(Text);

const RESET_ICON = { uri: 'ic_replay' };
const PLAY_ICON = { uri: 'ic_play_active' };
const DONE_ICON = { uri: 'ic_check' };

interface Props {
  isStarted: boolean;
  isRecorded: boolean;
  toggle: () => void;
  release: () => void;
  create: () => void;
}

const RecordController: React.FunctionComponent<Props> = ({
  isStarted,
  isRecorded,
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
    toValue: Number(!isStarted && isRecorded),
    duration: 200,
    useNativeDriver: true,
  });

  const progressAnimation = useRef(new Animated.Value(0));

  const labelStyle = useMemo(() => ({ opacity: labelAnimation }), [labelAnimation]);

  const buttonStyle = useMemo(() => ({ opacity: buttonAnimation }), [buttonAnimation]);

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
          disabled={isStarted || !isRecorded}
          style={styles.button}
          round
        >
          <Animated.Image source={RESET_ICON} style={[styles.icon, buttonStyle]} />
        </Button>
        <View style={styles.recordContainer}>
          <Animated.View style={[styles.progress, progressStyle]} />
          <TouchableOpacity activeOpacity={0.8} onPress={toggle} style={styles.record}>
            <Animated.Image source={PLAY_ICON} pointerEvents="none" style={[styles.playIcon, buttonStyle]} />
          </TouchableOpacity>
        </View>
        <Button
          onPress={onPressCreate}
          disabled={isStarted || !isRecorded}
          style={styles.button}
          round
        >
          <Animated.Image source={DONE_ICON} style={[styles.icon, buttonStyle]} />
        </Button>
      </View>
      <AnimatedText style={[typography.heading4, styles.hint, labelStyle]}>
        {isRecorded ? LocalizedStrings.RECORDER_PLAY_BUTTON : LocalizedStrings.RECORDER_RECORD_BUTTON}
      </AnimatedText>
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
  },
  hint: {
    color: palette.white.default,
  },
  recordContainer: {
    width: 72,
    height: 72,
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
    tintColor: 'rgba(255, 255, 255, 0.8)',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: palette.gray[10],
  },
});

export default React.memo(RecordController);
