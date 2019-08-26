import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { palette } from 'constants/style';

const LoadingView: React.FunctionComponent<{}> = () => (
  <View style={styles.container}>
    <ActivityIndicator color={palette.yellow.default} size="large" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.black.default,
  },
});

export default LoadingView;
