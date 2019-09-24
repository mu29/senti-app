import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  withNavigation,
  NavigationInjectedProps,
} from 'react-navigation';
import {
  Text,
  CachableImage,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { LocalizedStrings } from 'constants/translations';

const BUTTON_HITSLOP = {
  top: 16,
  bottom: 16,
  left: 10,
  right: 10,
};

interface Props extends NavigationInjectedProps {
  item: Profile;
}

const UserInfo: React.FunctionComponent<Props> = ({
  item: {
    name,
    email,
    photoUrl,
  },
  navigation,
}) => {
  const openEditProfileScreen = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <CachableImage prefix="profiles" source={photoUrl} style={styles.profile} />
      <View>
        <Text style={[typography.heading2, styles.name]}>
          {name}
        </Text>
        <Text style={styles.email}>
          {email}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openEditProfileScreen}
        hitSlop={BUTTON_HITSLOP}
        style={styles.button}
      >
        <Text style={typography.heading4}>
          {LocalizedStrings.PROFILE_EDIT}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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
    borderRadius: 28,
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
    backgroundColor: palette.gray[80],
  },
});

export default withNavigation(React.memo(UserInfo));
