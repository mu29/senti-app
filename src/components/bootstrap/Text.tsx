import React from 'react';
import {
  Text as TextNative,
  Platform,
  TextProps,
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

interface Props extends TextProps {
  children: React.ReactNode;
}

const Text: React.FunctionComponent<Props> = ({
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
