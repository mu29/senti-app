import React from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
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
  AuthState,
  AudioState,
  MessageState,
} from 'stores/states';
import {
  playMessageAction,
  pauseAudioAction,
} from 'stores/actions';
import { typography, palette } from 'constants/style';
import { toTimeText } from 'services/utils';

const PLAY_ICON = { uri: 'ic_play_active' };

const PAUSE_ICON = { uri: 'ic_pause' };

interface MessageItemProps {
  messageId: string;
  authState?: AuthState;
  audioState?: AudioState;
  messageState?: MessageState;
}

interface MessageItemState {
  isLoading: boolean;
}

@inject('authState', 'audioState', 'messageState')
@observer
class MessageItem extends React.Component<MessageItemProps, MessageItemState> {
  public state = {
    isLoading: false,
  };

  public render() {
    const { isLoading } = this.state;

    return (
      <View style={[styles.container, this.isMyMessage && styles.myMessage]}>
        <Button onPress={this.toggle} style={styles.message}>
          <View style={styles.iconContainer}>
            {isLoading
              ? (<ActivityIndicator color={palette.yellow.default} size="small" />)
              : (<Image source={this.audio.isPlaying ? PAUSE_ICON : PLAY_ICON} style={styles.icon} />)
            }
          </View>
          <View style={styles.content}>
            <View style={styles.time}>
              <Text style={typography.body2}>
                {this.audio.isActivated ? toTimeText(this.audio.currentTime) : '0:00'}
              </Text>
              <Text style={typography.body2}>
                /
              </Text>
              <Text style={typography.body2}>
                {toTimeText(this.message.audio.duration)}
              </Text>
            </View>
            <Text style={typography.tiny4}>
              {moment(this.message.createdAt).fromNow()}
            </Text>
          </View>
        </Button>
        {!this.isMyMessage && !this.message.readAt && (
          <View style={styles.dot} />
        )}
      </View>
    );
  }

  private get message() {
    const {
      messageId,
      messageState,
    } = this.props;

    return messageState!.messages[messageId] || {};
  }

  private get audio() {
    const { audioState } = this.props;

    return audioState!.audios[this.message.audio.id] || {};
  }

  private get isMyMessage() {
    const { id: messageUserId } = this.message.user;
    const { user } = this.props.authState!;

    return user && user.id === messageUserId;
  }

  private toggle = () => {
    const { messageId } = this.props;
    if (this.audio.isPlaying) {
      pauseAudioAction();
    } else {
      this.setState({
        isLoading: true,
      }, () => {
        playMessageAction(messageId)
          .catch(error => Alert.alert('알림', error.message))
          .finally(() => this.setState({ isLoading: false }));
      });
    }
  }
}

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

export default MessageItem;
