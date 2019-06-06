import React from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import moment from 'moment';
import {
  Text,
  Button,
} from 'components';
import {
  AudioState,
  MessageState,
} from 'stores/states';
import {
  playMessageAction,
  pauseAudioAction,
} from 'stores/actions';
import { LoadingType } from 'constants/enums';
import { typography, palette } from 'constants/style';
import { toTimeText } from 'services/utils';

const PLAY_ICON = { uri: 'ic_play_active' };

const PAUSE_ICON = { uri: 'ic_play' };

interface MessageItemProps {
  index: number;
  message: Message;
  audioState?: AudioState;
  messageState?: MessageState;
}

@inject('audioState', 'messageState')
@observer
class MessageItem extends React.Component<MessageItemProps> {
  public render() {
    const {
      message,
      audioState,
    } = this.props;

    return (
      <View style={styles.container}>
        <Button onPress={this.toggle} style={styles.message}>
          <View style={styles.iconContainer}>
            {this.isLoading
              ? (<ActivityIndicator color={palette.yellow.default} size="small" />)
              : (<Image source={this.isPlaying ? PAUSE_ICON : PLAY_ICON} style={styles.icon} />)
            }
          </View>
          <View style={styles.content}>
            <Text style={[typography.body1, styles.duration]}>
              {this.isPlaying ? toTimeText(audioState!.duration) : '0:00'}
              &nbsp;/&nbsp;
              {toTimeText(message.audio.duration)}
            </Text>
            <Text style={typography.tiny3}>
              {moment(message.createdAt).fromNow()}
            </Text>
          </View>
        </Button>
        <View style={styles.dot} />
      </View>
    );
  }

  private get isLoading() {
    const { message } = this.props;
    const { isPlaying } = this.props.audioState!;
    const { isLoading } = this.props.messageState!;

    return isPlaying(message.audio.url) && isLoading === LoadingType.READ;
  }

  private get isPlaying() {
    const { message } = this.props;
    const { isPaused, isPlaying } = this.props.audioState!;

    return !isPaused && isPlaying(message.audio.url);
  }

  private toggle = () => {
    const { index } = this.props;

    if (this.isPlaying) {
      pauseAudioAction();
    } else {
      playMessageAction(index);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 4,
    borderRadius: 32,
    backgroundColor: palette.gray[90],
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.gray[80],
  },
  icon: {
    width: 18,
    height: 18,
    marginLeft: 2,
    tintColor: palette.yellow.default,
  },
  content: {
    marginHorizontal: 12,
  },
  duration: {
    marginBottom: 2,
  },
  dot: {
    width: 8,
    height: 8,
    marginLeft: 4,
    borderRadius: 4,
    backgroundColor: palette.yellow.default,
  },
});

export default MessageItem;
