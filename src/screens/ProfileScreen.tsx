import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
  Header,
  UserInfo,
  CoinInventory,
} from 'components';
import { palette } from 'services/style';

const ProfileScreen = () => (
  <SafeAreaView style={styles.container}>
    <Header>
      프로필
    </Header>
    <View style={styles.info}>
      <UserInfo
        user={{
          displayName: '뮤바보',
          email: 'mu29@yeoubi.net',
          photoURL: 'https://avatars3.githubusercontent.com/u/8934513?s=460&v=4',
        }}
      />
      <View style={styles.divider} />
      <CoinInventory />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  info: {
    backgroundColor: palette.gray[90],
  },
  divider: {
    marginHorizontal: 16,
    height: 1,
    backgroundColor: palette.gray[80],
  },
});

export default ProfileScreen;
