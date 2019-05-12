import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { palette } from 'services/style';
import { withComma } from 'services/utils';

export interface TagItemProps {
  tag: Tag;
}

const TagItem: React.FunctionComponent<TagItemProps> = ({
  tag: {
    name,
    count,
    isSubscribed,
  },
}) => (
  <View style={styles.container}>
    <View style={styles.tag}>
      <Text style={styles.sharp}>
        #
      </Text>
    </View>
    <View>
      <Text style={styles.name}>
        {name}
      </Text>
      <Text style={styles.count}>
        이야기 {withComma(count)}개
      </Text>
    </View>
    <TouchableOpacity style={styles.button}>
      <Text style={[styles.normalText, isSubscribed && styles.subscribedText]}>
        구독
      </Text>
    </TouchableOpacity>
  </View>
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
    width: 32,
    height: 32,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: palette.gray[90],
  },
  sharp: {
    color: palette.yellow.default,
    fontSize: 18,
    fontWeight: '600',
  },
  name: {
    marginBottom: 4,
    color: palette.gray[20],
    fontSize: 14,
  },
  count: {
    color: palette.gray[50],
    fontSize: 12,
  },
  button: {
    marginLeft: 'auto',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 2,
    backgroundColor: palette.gray[90],
  },
  normalText: {
    color: palette.gray[20],
    fontSize: 14,
  },
  subscribedText: {
    color: palette.yellow.default,
  },
});

export default React.memo(TagItem);
