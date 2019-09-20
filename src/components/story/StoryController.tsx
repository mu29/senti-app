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
import {
  palette,
  typography,
} from 'constants/style';
import { AudioService, AnalyticsService } from 'services';

const HIT_SLOP = {
  top: 16,
  bottom: 16,
};

const REPLAY_ICON = { uri: 'ic_replay' };
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
  item,
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
    user: {
      photoUrl,
      name,
    },
    createdAt,
  } = item;

  const profileImage = useMemo(() => ({ uri: photoUrl || '' }), [photoUrl]);

  const showReportSheet = useCallback(() => {
    ActionSheet({
      title: '이 사용자를..',
      optionsIOS: ['신고하기', '취소'],
      optionsAndroid: ['신고하기'],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1,
      onCancelAndroidIndex: 1,
    }, (index: number) => {
      if (index === 0) {
        reportUser().catch(e => Alert.alert('오류', `사용자 신고에 실패했습니다.\n${e.message}`));
      }
    });
  }, [reportUser]);

  const showDeleteAlert = useCallback(() => {
    ActionSheet({
      title: '정말 삭제하시겠습니까?',
      optionsIOS: ['삭제', '취소'],
      optionsAndroid: ['삭제'],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1,
      onCancelAndroidIndex: 1,
    }, (index: number) => {
      if (index === 0) {
        deleteStory().catch(e => Alert.alert('오류', `이야기 삭제에 실패했습니다.\n${e.message}`));
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

  const onPressReplay = useCallback(() => {
    AudioService.replay();
    AnalyticsService.logEvent('click_story_replay');
  }, []);

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
        <Button hitSlop={HIT_SLOP} onPress={onPressReplay}>
          <Image source={REPLAY_ICON} style={styles.icon} />
        </Button>
        <Button hitSlop={HIT_SLOP} onPress={isMyStory ? onPressDelete : openReplyModal}>
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
