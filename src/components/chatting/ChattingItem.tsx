import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import moment from 'moment';
import { Text } from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { AuthStore } from 'stores';
import { withComma } from 'services/utils';

export interface ChattingItemProps {
  chatting: Chatting;
  authStore?: AuthStore;
}

@inject('authStore')
@observer
class ChattingItem extends React.Component<ChattingItemProps> {
  public render() {
    const {
      messageCount,
      updatedAt,
    } = this.props.chatting;

    return (
      <TouchableOpacity activeOpacity={0.8}>
        <View style={[styles.row, styles.container]}>
          <Image
            source={{ uri: this.partner.photoUrl || '' }}
            style={styles.profile}
          />
          <View style={styles.content}>
            <View style={styles.row}>
              <Text style={[typography.heading3, styles.partner]}>
                {this.partner.name}
              </Text>
              <Text style={styles.date}>
                {moment(updatedAt.toMillis()).fromNow()}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.messageCount}>
                이야기 {withComma(messageCount)}개
              </Text>
              <View style={styles.dot} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  private get partner() {
    const { user } = this.props.authStore!;
    const partnerId = Object.keys(this.props.chatting.userIds).filter(id => id !== user!.id)[0];

    return this.props.chatting.users[partnerId];
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profile: {
    width: 48,
    height: 48,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: palette.gray[80],
  },
  content: {
    flex: 1,
  },
  partner: {
    marginTop: Platform.select({
      ios: 4,
      android: 0,
    }),
    marginBottom: 4,
  },
  messageCount: {
    color: palette.gray[50],
    fontSize: 13,
  },
  date: {
    marginLeft: 'auto',
    color: palette.gray[60],
    fontSize: 12,
  },
  dot: {
    width: 8,
    height: 8,
    marginLeft: 'auto',
    borderRadius: 4,
    backgroundColor: palette.yellow.default,
  },
});

export default ChattingItem;
