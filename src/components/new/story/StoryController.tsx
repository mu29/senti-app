import React, { useCallback } from 'react';
import {
  View,
  Animated,
  Image,
  StyleSheet,
} from 'react-native';
import {
  Button,
  NewStoryProgressBar,
} from 'components';
import { useAudio } from 'containers';
import {
  AudioService,
  AnalyticsService,
} from 'services';
import { palette } from 'constants/style';

const AnimatedButton = Animated.createAnimatedComponent(Button);

const CHAT_ICON = { uri: 'ic_chat_active' };
const PLAY_ICON = { uri: 'ic_play_active' };
const STOP_ICON = { uri: 'ic_stop' };
const LIKE_ICON = { uri: 'ic_heart' };

interface Props {
  item: Story;
  isLoggedIn: boolean;
  showAuthModal: () => void;
  showReplyModal: () => void;
  showNextStory: () => void;
}

const StoryController: React.FunctionComponent<Props> = ({
  item,
  isLoggedIn,
  showAuthModal,
  showReplyModal,
  showNextStory,
}) => {
  const {
    audio,
    play,
    stop,
  } = useAudio(item.audio.url);

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

  return (
    <View style={styles.container}>
      <NewStoryProgressBar audio={audio} duration={item.audio.duration} />
      <View style={styles.controller}>
        <Button onPress={onPressReply} style={styles.button} round>
          <Image source={CHAT_ICON} style={styles.icon} />
        </Button>
        <View style={styles.button}>
          {audio.isPlaying ? (
            <AnimatedButton
              onPress={stop}
              isLoading={audio.isLoading}
              style={styles.nestedButton}
              round
            >
              <Image source={STOP_ICON} style={styles.bigIcon} />
            </AnimatedButton>
          ) : (
            <AnimatedButton
              onPress={play}
              isLoading={audio.isLoading}
              style={styles.nestedButton}
              round
            >
              <Image source={PLAY_ICON} style={styles.bigIcon} />
            </AnimatedButton>
          )}
        </View>
        <Button onPress={showNextStory} style={styles.button} round>
          <Image source={LIKE_ICON} style={styles.icon} />
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    padding: 24,
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
