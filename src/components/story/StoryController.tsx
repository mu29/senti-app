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
const CHAT_ICON = { uri: 'ic_chat_active' };
const DELETE_ICON = { uri: 'ic_delete' };

interface Props {
  item: Story;
  isLoggedIn: boolean;
  isMyStory: boolean;
  isLoading: boolean;
  hasBottom?: boolean;
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
    },
    createdAt,
  },
  isLoggedIn,
  isMyStory,
  isLoading,
  hasBottom,
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
    AudioService.pause();
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
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.profile}
          disabled={isMyStory}
          onPress={showReportSheet}
        >
          <Image source={profileImage} style={styles.photo} />
          <View>
            <Text style={[typography.heading3, styles.name]}>
              {name}
            </Text>
            <Text style={styles.date}>
              {dayjs(createdAt).fromNow()}
            </Text>
          </View>
        </TouchableOpacity>
        <Button hitSlop={HIT_SLOP} onPress={onPressToggle} isLoading={audio.isLoading} round>
          <Image source={audio.isPlaying ? STOP_ICON : PLAY_ICON} style={styles.icon} />
        </Button>
        <Button hitSlop={HIT_SLOP} onPress={isMyStory ? onPressDelete : openReplyModal} round>
          <Image source={isMyStory ? DELETE_ICON : CHAT_ICON} style={styles.icon} />
        </Button>
      </View>
      {isLoading && <LoadingLayer />}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingRight: 8,
  },
  profile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  withBottom: {
    marginBottom: 48,
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
  icon: {
    width: 28,
    height: 28,
    marginHorizontal: 16,
    tintColor: palette.gray[10],
  },
});

export default React.memo(StoryController);
