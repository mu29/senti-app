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
import { palette } from 'services/style';

export interface ButtonProps extends TouchableOpacityProps, TouchableNativeFeedbackProps {
  isCircle?: boolean;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactElement<any>;
}

const Button: React.FunctionComponent<ButtonProps> = ({
  isCircle,
  isLoading,
  style,
  children,
  ...props
}) => {
  const loadableChildren = isLoading ? <ActivityIndicator color={palette.white.default} /> : children;

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
