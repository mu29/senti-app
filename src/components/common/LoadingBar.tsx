import React, {
  useRef,
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

interface Props {
  isVisible: boolean;
}

const LoadingBar: React.FunctionComponent<Props> = ({
  isVisible,
}) => {
  const fadeAnimation = useRef(new Animated.Value(0));

  const scaleAnimation = useRef(new Animated.Value(0));

  const barStyle = useMemo(() => [
    styles.bar,
    { transform: [{ scaleX: scaleAnimation.current }] },
    { opacity: fadeAnimation.current },
  ], [scaleAnimation.current, fadeAnimation.current]);

  useEffect(() => {
    fadeAnimation.current.stopAnimation(() => {
      Animated.timing(fadeAnimation.current, {
        toValue: Number(!!isVisible),
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnimation.current, {
            toValue: deviceWidth,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimation.current, {
            toValue: 28,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scaleAnimation.current.stopAnimation();
    }
  }, [isVisible]);

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
