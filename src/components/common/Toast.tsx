import React from 'react';
import {
  Animated,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import { Text } from 'components';
import { palette, typography } from 'constants/style';

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'never',
  bottom: 'always',
};

interface State {
  message: string;
  showAt: number;
}

class Toast extends React.PureComponent<{}, State> {
  public state = {
    message: '',
    showAt: 0,
  };

  private fadeAnimation = new Animated.Value(0);

  private toastStyle = {
    ...styles.toast,
    opacity: this.fadeAnimation,
  };

  public static ref = React.createRef<Toast>();

  public static show(message: string) {
    this.ref.current && this.ref.current.show(message);
  }

  public componentDidUpdate() {
    this.fadeAnimation.stopAnimation();
    this.fadeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(this.fadeAnimation, {
        toValue: 1,
        duration: 200,
      }),
      Animated.timing(this.fadeAnimation, {
        toValue: 0,
        duration: 200,
        delay: 1500,
      }),
    ]).start();
  }

  public show(message: string) {
    this.setState({
      message,
      showAt: Date.now(),
    });
  }

  public render() {
    const { message } = this.state;

    return (
      <SafeAreaView forceInset={SAFE_AREA_INSET} pointerEvents="none" style={styles.container}>
        <Animated.View style={this.toastStyle}>
          <Text style={styles.message}>
            {message}
          </Text>
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: palette.transparent.black[80],
  },
  message: {
    ...typography.body3,
    color: palette.white.default,
  },
});

export default Toast;
