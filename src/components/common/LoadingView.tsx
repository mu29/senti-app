import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { palette } from 'constants/style';

interface Props {
  dark?: boolean;
}

const LoadingView: React.FunctionComponent<Props> = ({
  dark,
}) => (
  <View style={[styles.container, dark && styles.dark]}>
    <ActivityIndicator color={palette.yellow.default} size="large" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.gray[100],
  },
  dark: {
    backgroundColor: palette.black.default,
  },
});

export default LoadingView;
