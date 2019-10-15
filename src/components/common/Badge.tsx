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
    duration: 300,
    delay: 5000,
    useNativeDriver: true,
  });

  const containerStyle = useMemo(() => ({
    transform: [{
      scale: springAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 1],
        extrapolate: 'clamp',
      }),
    }],
  }), [springAnimation]);

  const textStyle = useMemo(() => ({
    transform: [{ scale: springAnimation }],
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
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: palette.yellow.default,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: palette.gray[100],
    fontSize: 10,
    paddingTop: Platform.select({
      ios: 1,
      android: 0,
    }),
  },
});

export default Badge;
