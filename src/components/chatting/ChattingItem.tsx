import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import moment from 'moment';
import { Text } from 'components';
import { palette } from 'services/style';
import { withComma } from 'services/utils';

export interface ChattingItemProps {
  chatting: Chatting;
}

const ChattingItem: React.FunctionComponent<ChattingItemProps> = ({
  chatting: {
    partner,
    lastMessage,
    messageCount,
  },
}) => (
  <TouchableOpacity activeOpacity={0.8}>
    <View style={[styles.row, styles.container]}>
      <Image
        source={{ uri: partner.photoURL }}
        style={styles.profile}
      />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.partner}>
            {partner.displayName}
          </Text>
          <Text style={styles.date}>
            {moment(lastMessage.createdAt).fromNow()}
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
    color: palette.gray[20],
    fontSize: 15,
    fontWeight: '600',
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
