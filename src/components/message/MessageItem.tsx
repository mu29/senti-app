import React, {
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import {
  Text,
  Button,
} from 'components';
import { typography, palette } from 'constants/style';
import { toTimeText } from 'services/utils';
import { useAudio } from 'containers';

const PLAY_ICON = { uri: 'ic_play_active' };
const PAUSE_ICON = { uri: 'ic_pause' };

interface Props {
  item: Message;
  userId: string;
  isLoading: boolean;
  loadAudio: () => void;
}

const MessageItem: React.FunctionComponent<Props> = ({
  item: {
    audio: {
      id,
      url,
      duration,
    },
    user,
    readAt,
    createdAt,
  },
  userId,
  isLoading,
  loadAudio,
}) => {
  const {
    audio,
    play,
    pause,
  } = useAudio(url);

  const isMyMessage = useMemo(() => user.id === userId, [user.id, userId]);

  const toggle = useCallback(() => {
    if (!url) {
      loadAudio();
      return;
    }

    audio.isPlaying
      ? pause()
      : play();
  }, [url, audio.isPlaying]);

  return (
    <View style={[styles.container, isMyMessage && styles.myMessage]}>
      <Button onPress={toggle} style={styles.message}>
        <View style={styles.iconContainer}>
          {isLoading
            ? (<ActivityIndicator color={palette.yellow.default} size="small" />)
            : (<Image source={audio.isPlaying ? PAUSE_ICON : PLAY_ICON} style={styles.icon} />)
          }
        </View>
        <View style={styles.content}>
          <View style={styles.time}>
            <Text style={typography.body2}>
              {audio.isActivated ? toTimeText(audio.elapsedTime) : '0:00'}
            </Text>
            <Text style={typography.body2}>
              /
            </Text>
            <Text style={typography.body2}>
              {toTimeText(duration)}
            </Text>
          </View>
          <Text style={typography.tiny4}>
            {moment(createdAt).fromNow()}
          </Text>
        </View>
      </Button>
      {!isMyMessage && !readAt && (
        <View style={styles.dot} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 4,
    borderRadius: 16,
    backgroundColor: palette.gray[90],
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.gray[80],
  },
  icon: {
    width: 14,
    height: 14,
    marginLeft: 2,
    tintColor: palette.yellow.default,
  },
  content: {
    marginLeft: 8,
    marginRight: 4,
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
  },
  dot: {
    width: 6,
    height: 6,
    marginLeft: 3,
    borderRadius: 3,
    backgroundColor: palette.yellow.default,
  },
});

export default React.memo(MessageItem);
