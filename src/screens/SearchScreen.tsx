import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
  SearchBar,
  TagList,
} from 'components';

const SearchScreen = () => (
  <SafeAreaView style={styles.container}>
    <SearchBar />
    <TagList
      data={[{
        id: 1,
        name: '고민',
        count: 3481,
        isSubscribed: false,
      }, {
        id: 2,
        name: '연애상담',
        count: 90163,
        isSubscribed: true,
      }, {
        id: 3,
        name: '불면증',
        count: 142,
        isSubscribed: false,
      }]}
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
});

export default SearchScreen;
