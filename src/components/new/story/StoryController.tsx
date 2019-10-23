import React, {
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Animated,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { useAnimation } from 'react-native-animation-hooks';
import ActionSheet from 'rn-actionsheet-module';
import {
  Button,
  NewStoryProgressBar,
} from 'components';
import {
  useAudio,
  NewStoryProfile,
} from 'containers';
import {
  AudioService,
  AnalyticsService,
} from 'services';
import { palette } from 'constants/style';
import { LocalizedStrings } from 'constants/translations';

const AnimatedButton = Animated.createAnimatedComponent(Button);

const CHAT_ICON = { uri: 'ic_chat_active' };
const DELETE_ICON = { uri: 'ic_delete' };
const PLAY_ICON = { uri: 'ic_play_active' };
const STOP_ICON = { uri: 'ic_stop' };
const LIKE_ICON = { uri: 'ic_heart' };

interface Props {
  item: Story;
  isLoggedIn: boolean;
  isMyStory: boolean;
  showAuthModal: () => void;
  showReplyModal: () => void;
  toggleLikeStory: () => void;
  deleteStory: () => Promise<any>;
}

const StoryController: React.FunctionComponent<Props> = ({
  item,
  isLoggedIn,
  isMyStory,
  showAuthModal,
  showReplyModal,
  toggleLikeStory,
  deleteStory,
}) => {
  const {
    audio,
    play,
    stop,
  } = useAudio(item.audio.url);

  const playAnimation = useAnimation({
    type: 'timing',
    toValue: Number(audio.isPlaying),
    duration: 200,
    useNativeDriver: true,
  });

  const playButtonStyle = useMemo(() => ({
    opacity: playAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.01],
      extrapolate: 'clamp',
    }),
    transform: [{
      scale: playAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.01],
        extrapolate: 'clamp',
      }),
    }],
  }), [playAnimation]);

  const stopButtonStyle = useMemo(() => ({
    opacity: playAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.01, 1],
      extrapolate: 'clamp',
    }),
    transform: [{
      scale: playAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.01, 1],
        extrapolate: 'clamp',
      }),
    }],
  }), [playAnimation]);

  const onPressReply = useCallback(() => {
    AnalyticsService.logEvent('click_story_reply');

    if (!isLoggedIn) {
      showAuthModal();
      return;
    }

    showReplyModal();
    AudioService.stop();
    AnalyticsService.logEvent('show_reply_modal');
  }, [isLoggedIn, showAuthModal, showReplyModal]);

  const onPressDelete = useCallback(() => {
    ActionSheet({
      title: LocalizedStrings.STORY_DELETE_ALERT,
      optionsIOS: [LocalizedStrings.COMMON_DELETE, LocalizedStrings.COMMON_CANCEL],
      optionsAndroid: [LocalizedStrings.COMMON_DELETE],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1,
      onCancelAndroidIndex: 1,
    }, (index: number) => {
      if (index === 0) {
        deleteStory().catch(e => Alert.alert(
          LocalizedStrings.COMMON_ERROR,
          LocalizedStrings.STORY_DELETE_FAILURE(e.message),
        ));
      }
    });
    AnalyticsService.logEvent('click_story_delete');
  }, [deleteStory]);

  return (
    <View style={styles.container}>
      <NewStoryProgressBar audio={audio} duration={item.audio.duration} />
      <View style={styles.controller}>
        <Button onPress={toggleLikeStory} style={styles.button} round>
          <Image source={LIKE_ICON} style={styles.icon} />
        </Button>
        {/* <View style={styles.button}>
          <AnimatedButton onPress={play} style={[styles.nestedButton, playButtonStyle]} isLoading={audio.isLoading} round>
            <Image source={PLAY_ICON} style={styles.bigIcon} />
          </AnimatedButton>
          <AnimatedButton onPress={stop} style={[styles.nestedButton, stopButtonStyle]} round>
            <Image source={STOP_ICON} style={styles.bigIcon} />
          </AnimatedButton>
        </View> */}
        <Button onPress={isMyStory ? onPressDelete : onPressReply} style={styles.button} round>
          <Image source={isMyStory ? DELETE_ICON : CHAT_ICON} style={styles.icon} />
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    padding: 16,
  },
  controller: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: palette.gray[80],
  },
  nestedButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigIcon: {
    width: 32,
    height: 32,
    tintColor: palette.gray[10],
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: palette.gray[20],
  },
});

export default StoryController;
