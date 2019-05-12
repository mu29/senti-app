import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { SearchBar } from 'components';

const SearchScreen = () => (
  <SafeAreaView style={styles.container}>
    <SearchBar />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
});

export default SearchScreen;
