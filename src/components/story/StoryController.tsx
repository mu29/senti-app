import React, {
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import ActionSheet from 'rn-actionsheet-module';
import dayjs from 'dayjs';
import {
  Text,
  Button,
  LoadingLayer,
  StoryProgressBar,
} from 'components';
import { useAudio } from 'containers';
import {
  AudioService,
  AnalyticsService,
} from 'services';
import {
  palette,
  typography,
} from 'constants/style';
import { LocalizedStrings } from 'constants/translations';

const HIT_SLOP = {
  top: 16,
  bottom: 16,
};

const PLAY_ICON = { uri: 'ic_play_active' };
const STOP_ICON = { uri: 'ic_stop' };
const NEXT_ICON = { uri: 'ic_next' };
const CHAT_ICON = { uri: 'ic_chat_active' };
const DELETE_ICON = { uri: 'ic_delete' };

interface Props {
  item: Story;
  isLoggedIn: boolean;
  isMyStory: boolean;
  isLoading: boolean;
  hasBottom?: boolean;
  onPressNext: () => void;
  showAuthModal: () => void;
  showReplyModal: () => void;
  reportUser: () => Promise<any>;
  deleteStory: () => Promise<any>;
}

const StoryController: React.FunctionComponent<Props> = ({
  item: {
    user: {
      name,
      photoUrl,
    },
    audio: {
      url,
      duration,
    },
    createdAt,
  },
  isLoggedIn,
  isMyStory,
  isLoading,
  hasBottom,
  onPressNext,
  showAuthModal,
  showReplyModal,
  reportUser,
  deleteStory,
}) => {
  const {
    audio,
    play,
    stop,
  } = useAudio(url);

  const profileImage = useMemo(() => ({ uri: photoUrl || '' }), [photoUrl]);

  const showReportSheet = useCallback(() => {
    ActionSheet({
      title: LocalizedStrings.STORY_USER_ACTIONS,
      optionsIOS: [LocalizedStrings.STORY_USER_ACTION_REPORT, LocalizedStrings.COMMON_CANCEL],
      optionsAndroid: [LocalizedStrings.STORY_USER_ACTION_REPORT],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1,
      onCancelAndroidIndex: 1,
    }, (index: number) => {
      if (index === 0) {
        reportUser().catch(e => Alert.alert(
          LocalizedStrings.COMMON_ERROR,
          LocalizedStrings.STORY_USER_ACTION_FAILURE(e.message),
        ));
      }
    });
  }, [reportUser]);

  const showDeleteAlert = useCallback(() => {
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
  }, [deleteStory]);

  const openReplyModal = useCallback(() => {
    AnalyticsService.logEvent('click_story_reply');

    if (!isLoggedIn) {
      showAuthModal();
      return;
    }

    showReplyModal();
    AudioService.stop();
    AnalyticsService.logEvent('show_reply_modal');
  }, [isLoggedIn, showAuthModal, showReplyModal]);

  const onPressToggle = useCallback(() => {
    audio.isPlaying ? stop() : play();
    AnalyticsService.logEvent(`click_story_${audio.isPlaying ? 'stop' : 'play'}`);
  }, [audio.isPlaying, stop, play]);

  const onPressDelete = useCallback(() => {
    showDeleteAlert();
    AnalyticsService.logEvent('click_story_delete');
  }, [showDeleteAlert]);

  return (
    <React.Fragment>
      <View style={[styles.container, hasBottom && styles.withBottom]}>
        <StoryProgressBar audio={audio} duration={duration} />
        <View style={styles.controller}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.profile}
            disabled={isMyStory}
            onPress={showReportSheet}
          >
            <Image key={photoUrl || ''} source={profileImage} style={styles.photo} />
            <View>
              <Text style={[typography.heading3, styles.name]}>
                {name}
              </Text>
              <Text style={styles.date}>
                {dayjs(createdAt).fromNow()}
              </Text>
            </View>
          </TouchableOpacity>
          <Button onPress={onPressToggle} isLoading={audio.isLoading} style={styles.button} round>
            <Image source={audio.isPlaying ? STOP_ICON : PLAY_ICON} style={styles.icon} />
          </Button>
          <Button onPress={onPressNext} style={styles.button} round>
            <Image source={NEXT_ICON} style={styles.icon} />
          </Button>
          <Button onPress={isMyStory ? onPressDelete : openReplyModal} style={styles.button} round>
            <Image source={isMyStory ? DELETE_ICON : CHAT_ICON} style={styles.icon} />
          </Button>
        </View>
      </View>
      {isLoading && <LoadingLayer />}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.000001)',
  },
  controller: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    paddingRight: 8,
    backgroundColor: palette.transparent.black[70],
  },
  profile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  withBottom: {
    bottom: 48,
  },
  photo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.gray[10],
  },
  name: {
    marginBottom: 2,
  },
  date: {
    color: palette.gray[30],
    fontSize: 12,
  },
  button: {
    width: 56,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: palette.gray[10],
  },
});

export default React.memo(StoryController);
