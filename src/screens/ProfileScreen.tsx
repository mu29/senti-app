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
      <UserInfo
        user={{
          id: '1',
          name: '뮤바보',
          email: 'mu29@yeoubi.net',
          photoUrl: 'https://avatars3.githubusercontent.com/u/8934513?s=460&v=4',
        }}
      />
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
