import React from 'react';
import {
  StatusBar,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewProps,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import { palette } from 'services/style';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: palette.gray[100],
  },
});

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'always',
  bottom: 'always',
};

function withSafeArea<P>(
  Component: React.ComponentType<P>,
  safeAreaProps: SafeAreaViewProps = {},
) {
  return (props: P) => (
    <SafeAreaView
      forceInset={SAFE_AREA_INSET}
      style={styles.container}
      {...safeAreaProps}
    >
      <Component {...props} />
    </SafeAreaView>
  );
}

export default withSafeArea;
