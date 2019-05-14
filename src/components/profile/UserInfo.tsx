import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Text } from 'bootstrap';
import { palette } from 'services/style';

export interface UserInfoProps {
  user: User;
}

const BUTTON_HITSLOP = {
  top: 16,
  bottom: 16,
  left: 10,
  right: 10,
};

const UserInfo: React.FunctionComponent<UserInfoProps> = ({
  user: {
    photoURL,
    displayName,
    email,
  },
}) => (
  <View style={styles.container}>
    <Image
      source={{ uri: photoURL }}
      style={styles.profile}
    />
    <View>
      <Text style={styles.name}>
        {displayName}
      </Text>
      <Text style={styles.email}>
        {email}
      </Text>
    </View>
    <TouchableOpacity
      activeOpacity={0.8}
      hitSlop={BUTTON_HITSLOP}
      style={styles.button}
    >
      <Text style={styles.edit}>
        정보 관리
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profile: {
    width: 56,
    height: 56,
    marginRight: 12,
    borderRadius: 20,
  },
  name: {
    marginTop: Platform.select({
      ios: 4,
      android: 0,
    }),
    marginBottom: 4,
    color: palette.gray[20],
    fontSize: 16,
    fontWeight: '600',
  },
  email: {
    color: palette.gray[50],
    fontSize: 12,
  },
  button: {
    marginLeft: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 2,
    backgroundColor: palette.gray[90],
  },
  edit: {
    color: palette.gray[10],
    fontSize: 14,
  },
});

export default UserInfo;
