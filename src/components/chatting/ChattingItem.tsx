import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  withNavigation,
  NavigationInjectedProps,
} from 'react-navigation';
import dayjs from 'dayjs';
import {
  Text,
  Button,
  CachableImage,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { LocalizedStrings } from 'constants/translations';

interface Props extends NavigationInjectedProps {
  item: Chatting;
}

const ChattingItem: React.FunctionComponent<Props> = ({
  item: {
    id,
    partner: {
      id: partnerId,
      name,
      photoUrl,
    },
    messageCount,
    unreadMessageCount,
    updatedAt,
  },
  navigation,
}) => {
  const [, setForceUpdate] = useState(0);

  const openMessageScreen = useCallback(() => {
    navigation.navigate('Message', {
      chattingId: id,
      partnerId,
      partnerName: name,
    });
  }, [id, name, navigation, partnerId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate(v => v + 1);
    }, 60 * 1000);

    return () => clearInterval(interval);
  });

  return (
    <Button onPress={openMessageScreen}>
      <View style={[styles.row, styles.container]}>
        <CachableImage prefix="profiles" source={photoUrl} style={styles.profile} />
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={[typography.heading3, styles.partner]}>
              {name}
            </Text>
            {unreadMessageCount > 0 && (
              <View style={styles.dot} />
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.messageCount}>
              {LocalizedStrings.CHATTING_MESSAGE_COUNT(messageCount)}
            </Text>
            <Text style={styles.date}>
              {dayjs(updatedAt).fromNow()}
            </Text>
          </View>
        </View>
      </View>
    </Button>
  );
};

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
    borderRadius: 24,
    backgroundColor: palette.gray[80],
    borderWidth: 1,
    borderColor: palette.gray[90],
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

export default withNavigation(React.memo(ChattingItem));
