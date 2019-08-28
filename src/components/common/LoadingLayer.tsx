import React, { useMemo } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';
import { useAnimation } from 'react-native-animation-hooks';
import { Text } from 'components';
import {
  palette,
  typography,
} from 'constants/style';

const LoadingLayer: React.FunctionComponent<{}> = () => {
  const fadeAnimation = useAnimation({
    type: 'timing',
    toValue: 1,
    initialValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const opacityStyle = useMemo(() => ({ opacity: fadeAnimation }), [fadeAnimation]);

  return (
    <Animated.View style={[styles.container, opacityStyle]}>
      <View style={styles.content}>
        <ActivityIndicator color={palette.yellow.default} size="large" />
        <Text style={[typography.heading4, styles.text]}>
          로딩 중..
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.transparent.black[20],
    zIndex: 999,
  },
  content: {
    padding: 24,
    paddingBottom: 16,
    borderRadius: 8,
    backgroundColor: palette.transparent.black[80],
  },
  text: {
    marginTop: 16,
  },
});

export default React.memo(LoadingLayer);
