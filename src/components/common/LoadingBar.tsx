import React, {
  useMemo,
  useEffect,
} from 'react';
import {
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { palette } from 'constants/style';

const { width: deviceWidth } = Dimensions.get('window');

const LoadingBar: React.FunctionComponent<{}> = () => {
  const scaleAnimation = useMemo(() => new Animated.Value(0), []);

  const barStyle = useMemo(() => [
    styles.bar,
    { transform: [{ scaleX: scaleAnimation }] },
  ], [scaleAnimation]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: deviceWidth,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 28,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={barStyle} />
  );
};

const styles = StyleSheet.create({
  bar: {
    alignSelf: 'center',
    width: 1,
    height: 1,
    backgroundColor: palette.gray[30],
  },
});

export default React.memo(LoadingBar);
