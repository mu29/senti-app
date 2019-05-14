import React from 'react';
import {
  Text as TextNative,
  Platform,
  TextProps as TextNativeProps,
} from 'react-native';

const defaultStyle = Platform.select({
  ios: {
    fontFamily: 'AppleSDGothicNeo-Regular',
  },
  android: {
    fontFamily: 'sans-serif',
    includeFontPadding: false,
  },
});

export interface TextProps extends TextNativeProps {
  children: React.ReactNode;
}

const Text: React.FunctionComponent<TextProps> = ({
  children,
  style,
  ...props
}) => (
  <TextNative
    allowFontScaling={false}
    style={[defaultStyle, style]}
    {...props}
  >
    {children}
  </TextNative>
);

export default React.memo(Text);
