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

export interface Props extends TextProps {
  children: React.ReactNode;
}

// Animated를 위해 Class Component로 남겨둔다
class Text extends React.PureComponent<Props> {
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
