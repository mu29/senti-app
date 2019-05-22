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

class Text extends React.PureComponent<TextProps> {
  public render() {
    const {
      children,
      style,
      ...props
    } = this.props;

    return (
      <TextNative
        allowFontScaling={false}
        style={[defaultStyle, style]}
        {...props}
      >
        {children}
      </TextNative>
    );
  }
}

export default Text;
