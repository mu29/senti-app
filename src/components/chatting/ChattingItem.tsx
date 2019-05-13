import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import { palette } from 'services/style';
import { withComma } from 'services/utils';

export interface ChattingItemProps {
  partner: User;
  lastMessage: Message;
  messageCount: number;
}

const ChattingItem: React.FunctionComponent<ChattingItemProps> = ({
  partner,
  lastMessage,
  messageCount,
}) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.partner}>
        {partner.displayName}
      </Text>
      <Text style={styles.messageCount}>
        이야기 {withComma(messageCount)}개
      </Text>
    </View>
    <Text style={styles.date}>
      {moment(lastMessage.createdAt).fromNow()}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  partner: {
    marginBottom: 4,
    color: palette.gray[20],
    fontSize: 14,
  },
  messageCount: {
    color: palette.gray[50],
    fontSize: 12,
  },
  date: {
    marginLeft: 'auto',
    color: palette.gray[40],
    fontSize: 10,
  },
});

export default ChattingItem;
