import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Header,
  UserInfo,
  CoinInventory,
  withSafeArea,
} from 'components';
import { palette } from 'constants/style';

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
});

export default withSafeArea(ProfileScreen);
