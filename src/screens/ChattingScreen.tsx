import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { ChattingItem } from 'components';

const ChattingScreen = () => (
  <SafeAreaView style={styles.container}>
    <ChattingItem
      partner={{
        displayName: '뮤바보',
        email: '',
      }}
      lastMessage={{
        audioUrl: '',
        duration: 29,
        createdAt: '2019-05-14 08:01:00',
      }}
      messageCount={2}
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
});

export default ChattingScreen;
