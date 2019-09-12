import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
} from 'components';
import { palette } from 'constants/style';
import { withComma } from 'utils';

const TAG_ICON = { uri: 'ic_tag' };

const TAG_HITSLOP = {
  top: 16,
  bottom: 16,
  left: 10,
  right: 10,
};

export interface Props {
  item: Tag;
  isLoading: boolean;
  isSubscribed: boolean;
  toggle: () => void;
  openTagStoryScreen: () => void;
}

export interface TagItemState {
  isLoading: boolean;
}

const TagItem: React.FunctionComponent<Props> = ({
  item: {
    name,
    storyCount,
  },
  isLoading,
  isSubscribed,
  toggle,
  openTagStoryScreen,
}) => (
  <TouchableOpacity onPress={openTagStoryScreen} activeOpacity={0.8}>
    <View style={styles.container}>
      <View style={styles.tag}>
        <Image source={TAG_ICON} style={styles.icon} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>
          {name}
        </Text>
        <Text style={styles.count}>
          이야기 {withComma(storyCount)}개
        </Text>
      </View>
      <Button
        hitSlop={TAG_HITSLOP}
        isLoading={isLoading}
        onPress={toggle}
        style={styles.button}
      >
        <Text style={[styles.normalText, isSubscribed && styles.subscribedText]}>
          관심
        </Text>
      </Button>
    </View>
  </TouchableOpacity>
);

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
