import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const Header: React.FunctionComponent<{}> = () => (
  <View style={styles.container}>
    <Text style={styles.title}>
      토픽
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#212121',
  },
});

export default Header;
