import React, { useMemo, useCallback } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import dayjs from 'dayjs';
import {
  Text,
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
  showDeleteAlert: () => void;
}

const StoryController: React.FunctionComponent<Props> = ({
  item,
  isLoggedIn,
  isMyStory,
  isLoading,
  hasBottom,
  showAuthModal,
  showReplyModal,
  showDeleteAlert,
}) => {
  const {
    user: {
      photoUrl,
      name,
    },
    createdAt,
  } = item;

  const profileImage = useMemo(() => ({ uri: photoUrl || '' }), [photoUrl]);

  const openReplyModal = useCallback(() => {
    AnalyticsService.logEvent('click_story_reply');

    if (!isLoggedIn) {
      showAuthModal();
      return;
    }

    showReplyModal();
    AudioService.pause();
    AnalyticsService.logEvent('show_reply_modal');
  }, [isLoggedIn]);

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
        <Image
          source={profileImage}
          style={styles.photo}
        />
        <View style={styles.profile}>
          <Text style={[typography.heading3, styles.name]}>
            {name}
          </Text>
          <Text style={styles.date}>
            {dayjs(createdAt).fromNow()}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={HIT_SLOP}
          onPress={onPressReplay}
        >
          <Image source={REPLAY_ICON} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={HIT_SLOP}
          onPress={isMyStory ? onPressDelete : openReplyModal}
        >
          <Image source={isMyStory ? DELETE_ICON : CHAT_ICON} style={styles.icon} />
        </TouchableOpacity>
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
  profile: {
    flex: 1,
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
