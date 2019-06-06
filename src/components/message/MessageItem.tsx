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
  AuthState,
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
    const { message } = this.props;
    const { current } = this.props.audioState!;
    const { isLoading } = this.state;

    return (
      <View style={[styles.container, this.isMyMessage && styles.myMessage]}>
        <Button onPress={this.toggle} style={styles.message}>
          <View style={styles.iconContainer}>
            {isLoading
              ? (<ActivityIndicator color={palette.yellow.default} size="small" />)
              : (<Image source={this.isPlaying ? PAUSE_ICON : PLAY_ICON} style={styles.icon} />)
            }
          </View>
          <View style={styles.content}>
            <Text style={[typography.body1, styles.duration]}>
              {this.isActivated ? toTimeText(current!.duration) : '0:00'}
              &nbsp;/&nbsp;
              {toTimeText(message.audio.duration)}
            </Text>
            <Text style={typography.tiny3}>
              {moment(message.createdAt).fromNow()}
            </Text>
          </View>
        </Button>
        {!this.isMyMessage && (
          <View style={styles.dot} />
        )}
      </View>
    );
  }

  private get isActivated() {
    const { message } = this.props;
    const { isActivated } = this.props.audioState!;

    return isActivated(message.audio.url);
  }

  private get isPlaying() {
    return this.isActivated && !this.props.audioState!.isPaused;
  }

  private get isMyMessage() {
    const { id: messageUserId } = this.props.message.user;
    const { user } = this.props.authState!;

    return user && user.id === messageUserId;
  }

  private toggle = () => {
    const { index } = this.props;

    if (this.isPlaying) {
      pauseAudioAction();
    } else {
      this.setState({
        isLoading: true,
      }, async () => {
        await playMessageAction(index);
        this.setState({ isLoading: false });
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
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
