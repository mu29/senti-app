import React from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  TouchableOpacityProps,
  TouchableNativeFeedbackProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { palette } from 'constants/style';

export interface ButtonProps extends TouchableOpacityProps, TouchableNativeFeedbackProps {
  isCircle?: boolean;
  isLoading?: boolean;
  indicatorSize?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactElement<any>;
}

const Button: React.FunctionComponent<ButtonProps> = ({
  isCircle,
  isLoading,
  indicatorSize,
  style,
  children,
  ...props
}) => {
  const loadableChildren = isLoading ? (
    <View style={{ justifyContent: 'center', height: indicatorSize || 24 }}>
      <ActivityIndicator color={palette.white.default} />
    </View>
  ) : children;

  return Platform.select({
    ios: (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isLoading}
        {...props}
      >
        <View style={style}>
          {loadableChildren}
        </View>
      </TouchableOpacity>
    ),
    android: (
      <TouchableNativeFeedback
        disabled={isLoading}
        background={isCircle
          ? TouchableNativeFeedback.SelectableBackgroundBorderless()
          : TouchableNativeFeedback.SelectableBackground()
        }
        {...props}
      >
        <View style={style}>
          {loadableChildren}
        </View>
      </TouchableNativeFeedback>
    ),
  });
};

export default React.memo(Button);
