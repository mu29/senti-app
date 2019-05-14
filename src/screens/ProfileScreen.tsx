import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
  Header,
  UserInfo,
} from 'components';

const ProfileScreen = () => (
  <SafeAreaView style={styles.container}>
    <Header>
      프로필
    </Header>
    <UserInfo
      user={{
        displayName: '뮤바보',
        email: 'mu29@yeoubi.net',
        photoURL: 'https://avatars3.githubusercontent.com/u/8934513?s=460&v=4',
      }}
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
});

export default ProfileScreen;
