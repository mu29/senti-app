import React, { useMemo } from 'react';
import {
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useAnimation } from 'react-native-animation-hooks';
import { Text } from 'components';
import { palette } from 'constants/style';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface Props {
  count: number;
}

const Badge: React.FunctionComponent<Props> = ({
  count,
}) => {
  const springAnimation = useAnimation({
    type: 'timing',
    toValue: 0,
    initialValue: 1,
    duration: 6000,
    useNativeDriver: true,
  });

  const containerStyle = useMemo(() => ({
    transform: [{
      scale: springAnimation.interpolate({
        inputRange: [0, 0.005, 0.99, 0.995, 1],
        outputRange: [0.4, 1, 1, 1.2, 0.4],
        extrapolate: 'clamp',
      }),
    }],
  }), [springAnimation]);

  const textStyle = useMemo(() => ({
    transform: [{
      scale: springAnimation.interpolate({
        inputRange: [0, 0.005, 0.99, 0.995, 1],
        outputRange: [0.01, 1, 1, 1.2, 0.01],
        extrapolate: 'clamp',
      }),
    }],
  }), [springAnimation]);

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <AnimatedText style={[styles.text, textStyle]}>
        {count}
      </AnimatedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 6,
    right: 12,
    width: 14,
    height: 14,
    borderRadius: 8,
    backgroundColor: palette.yellow.default,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: palette.black.default,
    fontWeight: 'bold',
    fontSize: 10,
    paddingTop: Platform.select({
      ios: 2,
      android: 0,
    }),
    paddingLeft: Platform.select({
      ios: 1,
      android: 0,
    }),
  },
});

export default Badge;
