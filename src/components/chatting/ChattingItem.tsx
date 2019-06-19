import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  withNavigation,
  NavigationInjectedProps,
} from 'react-navigation';
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
  palette,
  typography,
} from 'constants/style';
import { AuthState } from 'stores/states';
import { withComma } from 'services/utils';

export interface ChattingItemProps {
  chatting: Chatting;
  authState?: AuthState;
}

@inject('authState')
@observer
class ChattingItem extends React.Component<ChattingItemProps & NavigationInjectedProps> {
  public render() {
    const {
      messageCount,
      updatedAt,
    } = this.props.chatting;

    return (
      <Button onPress={this.openMessageScreen}>
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
                {moment(updatedAt).fromNow()}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.messageCount}>
                이야기 {withComma(messageCount)}개
              </Text>
              {this.unreadMessageCount > 0 && (
                <View style={styles.dot} />
              )}
            </View>
          </View>
        </View>
      </Button>
    );
  }

  private get partner() {
    const { user } = this.props.authState!;
    const partnerId = Object.keys(this.props.chatting.userIds).filter(id => id !== user!.id)[0];

    return this.props.chatting.users[partnerId];
  }

  private get unreadMessageCount() {
    const {
      chatting: {
        unreadMessageCount,
      },
      authState,
    } = this.props;

    if (!authState!.user) {
      return 0;
    }

    return unreadMessageCount[authState!.user.id] || 0;
  }

  private openMessageScreen = () => {
    const {
      navigation,
      chatting,
    } = this.props;

    navigation.navigate('Message', {
      chattingId: chatting.id,
      partnerId: this.partner.id,
      partnerName: this.partner.name,
    });
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

export default withNavigation(ChattingItem);
