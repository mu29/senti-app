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
import {
  palette,
  typography,
} from 'constants/style';

const BUTTON_HITSLOP = {
  top: 16,
  bottom: 16,
  left: 10,
  right: 10,
};

interface UserInfoProps {
  authState?: AuthState;
}

@inject('authState')
@observer
class UserInfo extends React.Component<UserInfoProps> {
  public render() {
    const { user } = this.props.authState!;

    if (!user) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Image
          source={{ uri: user.photoUrl || '' }}
          style={styles.profile}
        />
        <View>
          <Text style={[typography.heading2, styles.name]}>
            {user.name}
          </Text>
          <Text style={styles.email}>
            {user.email}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={BUTTON_HITSLOP}
          style={styles.button}
        >
          <Text style={typography.heading4}>
            정보 관리
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

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
    borderRadius: 24,
  },
  name: {
    marginTop: Platform.select({
      ios: 4,
      android: 0,
    }),
    marginBottom: 4,
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
    backgroundColor: palette.gray[70],
  },
});

export default UserInfo;
