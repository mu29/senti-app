import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Text,
  Header,
  withSafeArea,
} from 'components';
import {
  UserInfo,
  CoinInventory,
  CoinModal,
  MyStoryGrid,
} from 'containers';
import {
  palette,
  typography,
} from 'constants/style';

const ProfileScreen = () => (
  <React.Fragment>
    <Header>
      프로필
    </Header>
    <View style={styles.info}>
      <UserInfo />
      <View style={styles.divider} />
      <CoinInventory />
    </View>
    <View style={styles.stories}>
      <Icon name="ios-albums" size={16} color={palette.gray[20]} />
      <Text style={[typography.heading3, styles.title]}>
        나의 이야기
      </Text>
    </View>
    <MyStoryGrid />
    <CoinModal />
  </React.Fragment>
);

const styles = StyleSheet.create({
  info: {
    backgroundColor: palette.gray[90],
  },
  divider: {
    marginHorizontal: 16,
    height: 1,
    backgroundColor: palette.gray[80],
  },
  title: {
    marginLeft: 6,
  },
  stories: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray[90],
  },
});

export default withSafeArea(ProfileScreen);
