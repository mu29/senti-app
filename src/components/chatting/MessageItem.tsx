import React from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import {
  Text,
  Button,
} from 'components';
import { typography, palette } from 'constants/style';

const PLAY_ICON = { uri: 'ic_play_active' };

interface MessageItemProps {
  index: number;
  message: Message;
}

class MessageItem extends React.PureComponent<MessageItemProps> {
  public render() {
    const { message } = this.props;

    return (
      <View style={styles.container}>
        <Button style={styles.message}>
          <View style={styles.iconContainer}>
            <Image source={PLAY_ICON} style={styles.icon} />
          </View>
          <View style={styles.content}>
            <Text style={[typography.body1, styles.duration]}>
              0:00 / 0:17
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
