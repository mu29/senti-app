import React from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  LayoutChangeEvent,
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
  index: number;
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

  private timeLayout: {
    width?: number;
    height?: number;
  } = {};

  public render() {
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
            <View onLayout={this.onTimeLayout} style={[styles.time, this.timeLayout]}>
              <Text style={[typography.body2, styles.duration]}>
                {this.isActivated ? toTimeText(current!.duration) : '0:00'}
              </Text>
              <View style={styles.divider}>
                <Text style={typography.body2}>
                  /
                </Text>
              </View>
              <Text style={[typography.body2, styles.duration]}>
                {toTimeText(this.message.audio.duration)}
              </Text>
            </View>
            <Text style={[typography.tiny4, styles.duration]}>
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
      index,
      messageState,
    } = this.props;

    return messageState!.messages[index];
  }

  private get isActivated() {
    const { isActivated } = this.props.audioState!;

    return isActivated(this.message.audio.url);
  }

  private get isPlaying() {
    return this.isActivated && !this.props.audioState!.isPaused;
  }

  private get isMyMessage() {
    const { id: messageUserId } = this.message.user;
    const { user } = this.props.authState!;

    return user && user.id === messageUserId;
  }

  private onTimeLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { width, height } = nativeEvent.layout;
    this.timeLayout = { width, height };
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
    marginLeft: 4,
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  duration: {
    marginHorizontal: 4,
  },
  divider: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
