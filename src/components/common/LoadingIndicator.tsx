import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { palette } from 'constants/style';

const LoadingIndicator: React.FunctionComponent<{}> = () => (
  <View style={styles.container}>
    <ActivityIndicator color={palette.gray[40]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default React.memo(LoadingIndicator);
