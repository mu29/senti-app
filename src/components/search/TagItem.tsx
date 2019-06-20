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
import { Text } from 'components';
import { AuthState } from 'stores/states';
import { palette } from 'constants/style';
import { withComma } from 'services/utils';

const TAG_ICON = { uri: 'ic_tag' };

const TAG_HITSLOP = {
  top: 16,
  bottom: 16,
  left: 10,
  right: 10,
};

export interface TagItemProps {
  tag: Tag;
  authState?: AuthState;
}

@inject('authState')
@observer
class TagItem extends React.Component<TagItemProps> {
  public render() {
    const {
      id,
      name,
      storyCount,
    } = this.props.tag;

    return (
      <TouchableOpacity activeOpacity={0.8}>
        <View style={styles.container}>
          <View style={styles.tag}>
            <Image source={TAG_ICON} style={styles.icon} />
          </View>
          <View>
            <Text style={styles.name}>
              {name}
            </Text>
            <Text style={styles.count}>
              이야기 {withComma(storyCount)}개
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={TAG_HITSLOP}
            style={styles.button}
          >
            <Text style={[styles.normalText, this.isSubscribed && styles.subscribedText]}>
              관심
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  private get isSubscribed() {
    const {
      tag,
      authState,
    } = this.props;

    return authState!.user && (authState!.user.subscribedTags || []).find(t => t.id === tag.id);
  }
}

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
    marginLeft: 'auto',
    paddingVertical: 6,
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

export default TagItem;
