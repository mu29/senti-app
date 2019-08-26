import React from 'react';
import {
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { palette } from 'constants/style';

const { width: windowWidth } = Dimensions.get('window');

class LoadingBar extends React.PureComponent<{}> {
  private scaleAnimation = new Animated.Value(0);

  private barStyle = [
    styles.bar,
    { transform: [{ scaleX: this.scaleAnimation }] },
  ];

  public componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.scaleAnimation, {
          toValue: windowWidth,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(this.scaleAnimation, {
          toValue: 28,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }

  public render() {
    return (
      <Animated.View style={this.barStyle} />
    );
  }
}

const styles = StyleSheet.create({
  bar: {
    alignSelf: 'center',
    width: 1,
    height: 1,
    backgroundColor: palette.gray[30],
  },
});

export default LoadingBar;
