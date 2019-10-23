import React, {
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import ActionSheet from 'rn-actionsheet-module';
import Icon from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import {
  Text,
  Button,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { LocalizedStrings } from 'constants/translations';

const HIT_SLOP = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20,
};

interface Props {
  item: Story;
  reportUser: () => Promise<any>;
}

const StoryProfile: React.FunctionComponent<Props> = ({
  item,
  reportUser,
}) => {
  const profileImage = useMemo(() => ({ uri: item.user.photoUrl || '' }), [item]);

  const showReportSheet = useCallback(() => {
    ActionSheet({
      title: LocalizedStrings.STORY_USER_ACTIONS,
      optionsIOS: [LocalizedStrings.STORY_USER_ACTION_REPORT, LocalizedStrings.COMMON_CANCEL],
      optionsAndroid: [LocalizedStrings.STORY_USER_ACTION_REPORT],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1,
      onCancelAndroidIndex: 1,
    }, (index: number) => {
      if (index === 0) {
        reportUser().catch(e => Alert.alert(
          LocalizedStrings.COMMON_ERROR,
          LocalizedStrings.STORY_USER_ACTION_FAILURE(e.message),
        ));
      }
    });
  }, [reportUser]);

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image source={profileImage} style={styles.photo} />
        <View>
          <Text style={[typography.heading3, styles.name]}>
            {item.user.name}
          </Text>
          <Text style={styles.date}>
            {dayjs(item.createdAt).fromNow()}
          </Text>
        </View>
      </View>
      <Button hitSlop={HIT_SLOP} onPress={showReportSheet} round>
        <Icon name="ios-more" size={24} color={palette.gray[10]} />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.gray[10],
  },
  name: {
    marginBottom: 2,
  },
  date: {
    color: palette.gray[30],
    fontSize: 12,
  },
});

export default StoryProfile;
