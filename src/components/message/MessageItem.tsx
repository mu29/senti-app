import React, {
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import {
  Text,
  Button,
} from 'components';
import { typography, palette } from 'constants/style';
import { toTimeText } from 'utils';
import { useAudio } from 'containers';
import { AnalyticsService } from 'services';

const PLAY_ICON = { uri: 'ic_play_active' };
const PAUSE_ICON = { uri: 'ic_pause' };

interface Props {
  item: Message;
  profile: Profile;
  isLoading: boolean;
  loadAudio: () => void;
}

const MessageItem: React.FunctionComponent<Props> = ({
  item: {
    audio: {
      url,
      duration,
    },
    user,
    readAt,
    createdAt,
  },
  profile,
  isLoading,
  loadAudio,
}) => {
  const isInitialLoaded = useRef(false);

  const {
    audio,
    play,
    pause,
  } = useAudio(url);

  const isMyMessage = useMemo(() => user.id === profile.id, [user.id, profile.id]);

  const toggle = useCallback(() => {
    if (!url) {
      AnalyticsService.logEvent(`click_${isMyMessage ? 'my' : 'partner'}_message_play`);
      if (profile.useFreeCoinAt + 300 * 1000 > Date.now()) {
        if (profile.coin > 0) {
          Alert.alert('메시지 듣기', '1코인을 사용하여 메시지를 확인하시겠습니까?', [{
            text: '확인',
            onPress: () => loadAudio(),
          }], {
            cancelable: true,
          });
        } else {
          Alert.alert('오류', '코인을 구매하거나 무료 코인을 사용하세요.');
        }
      } else {
        loadAudio();
      }
      return;
    }

    audio.isPlaying ? pause() : play();
    AnalyticsService.logEvent(`click_${isMyMessage ? 'my' : 'partner'}_message_${audio.isPlaying ? 'pause' : 'play'}`);
  }, [url, audio.isPlaying, pause, play, isMyMessage, profile.useFreeCoinAt, profile.coin, loadAudio]);

  useEffect(() => {
    if (!isInitialLoaded.current) {
      isInitialLoaded.current = true;
      return;
    }

    if (url) {
      play();
    }
  }, [play, url]);

  return (
    <View style={[styles.container, isMyMessage && styles.myMessage]}>
      <Button onPress={toggle} style={styles.message}>
        <View style={styles.iconContainer}>
          {isLoading || audio.isLoading
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
            {dayjs(createdAt).fromNow()}
          </Text>
        </View>
      </Button>
      {!isMyMessage && !readAt && (
        <Icon name="md-lock" size={16} color={palette.yellow.default} />
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
    marginRight: 0,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 8,
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
