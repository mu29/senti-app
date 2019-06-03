import React from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { Text } from 'components';
import { typography, palette } from 'constants/style';

const CHAT_ICON = { uri: 'ic_chat_active' };

const ChattingEmptyList: React.FunctionComponent<{}> = () => (
  <View style={styles.container}>
    <View style={styles.iconContainer}>
      <Image source={CHAT_ICON} style={styles.icon} />
    </View>
    <Text style={[typography.body1, styles.description]}>
      {'이야기에 답변해\n새로운 대화를 시작해 보세요.'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 16,
    paddingTop: 18,
    marginBottom: 32,
    borderRadius: 48,
    backgroundColor: palette.gray[90],
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: palette.gray[20],
  },
  description: {
    marginBottom: 96,
    textAlign: 'center',
  },
});

export default ChattingEmptyList;
