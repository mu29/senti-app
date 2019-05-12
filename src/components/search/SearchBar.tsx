import React from 'react';
import {
  View,
  Image,
  TextInput,
  StyleSheet,
} from 'react-native';
import { palette } from 'services/style';

const SEARCH_ICON = { uri: 'search' };

export interface SearchBarProps {}

class SearchBar extends React.PureComponent<SearchBarProps> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bar}>
          <Image source={SEARCH_ICON} style={styles.icon} />
          <TextInput
            placeholder="검색"
            placeholderTextColor={palette.gray[50]}
            style={styles.input}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomColor: palette.gray[90],
    borderBottomWidth: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: palette.gray[90],
  },
  icon: {
    width: 12,
    height: 12,
    marginLeft: 8,
    tintColor: palette.gray[50],
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    color: palette.gray[20],
  },
});

export default SearchBar;
