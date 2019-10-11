import React, { useCallback } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
} from 'components';
import { palette } from 'constants/style';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

const TAG_ICON = { uri: 'ic_tag' };

const TAG_HITSLOP = {
  top: 16,
  bottom: 16,
  left: 10,
  right: 10,
};

export interface Props {
  item: Tag;
  isLoggedIn: boolean;
  isLoading: boolean;
  isSubscribed: boolean;
  toggle: () => Promise<any>;
  showAuthModal: () => void;
  openTagStoryScreen: () => void;
}

export interface TagItemState {
  isLoading: boolean;
}

const TagItem: React.FunctionComponent<Props> = ({
  item: {
    id,
    storyCount,
  },
  isLoggedIn,
  isLoading,
  isSubscribed,
  toggle,
  showAuthModal,
  openTagStoryScreen,
}) => {
  const onPress = useCallback(() => {
    if (!isLoggedIn) {
      showAuthModal();
      return;
    }

    toggle().catch(e => Alert.alert(
      LocalizedStrings.COMMON_ERROR,
      LocalizedStrings.SUBSCRIBE_TAG_FAILURE(e.message),
    ));
    AnalyticsService.logEvent(`click_${isSubscribed ? 'unsubscribe' : 'subscribe'}_tag`);
  }, [isLoggedIn, toggle, isSubscribed, showAuthModal]);

  return (
    <Button onPress={openTagStoryScreen} activeOpacity={0.8}>
      <View style={styles.container}>
        <View style={styles.tag}>
          <Image source={TAG_ICON} style={styles.icon} />
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>
            {id}
          </Text>
          <Text style={styles.count}>
            {LocalizedStrings.TAG_STORY_COUNT(storyCount)}
          </Text>
        </View>
        <Button
          hitSlop={TAG_HITSLOP}
          isLoading={isLoading}
          onPress={onPress}
          style={styles.button}
        >
          <Text style={[styles.normalText, isSubscribed && styles.subscribedText]}>
            {LocalizedStrings.TAG_SUBSCRIBE_BUTTON}
          </Text>
        </Button>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tag: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: palette.gray[80],
  },
  icon: {
    width: 14,
    height: 14,
    tintColor: palette.yellow.default,
  },
  content: {
    flex: 1,
  },
  name: {
    marginTop: Platform.select({
      ios: 4,
      android: 0,
    }),
    marginBottom: 4,
    color: palette.gray[10],
    fontSize: 15,
  },
  count: {
    color: palette.gray[50],
    fontSize: 13,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 2,
    backgroundColor: palette.gray[90],
  },
  normalText: {
    color: palette.gray[10],
    fontSize: 14,
  },
  subscribedText: {
    color: palette.yellow.default,
  },
});

export default React.memo(TagItem);
