import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import dayjs from 'dayjs';
import { Text } from 'components';
import { palette } from 'constants/style';

interface Props {
  item: Transaction;
}

const TransactionItem: React.FunctionComponent<Props> = ({
  item: {
    amount,
    description,
    createdAt,
  },
}) => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.description}>
        {description}
      </Text>
      <Text style={styles.date}>
        {dayjs(createdAt).format('YYYY년 M월 D일 HH시')}
      </Text>
    </View>
    <Text style={[styles.amount, amount < 0 && styles.minus]}>
      {amount < 0 ? '-' : '+'}{Math.abs(amount)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: palette.gray[20],
  },
  date: {
    fontSize: 12,
    color: palette.gray[50],
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.yellow.default,
  },
  minus: {
    color: palette.gray[50],
  },
});

export default React.memo(TransactionItem);
