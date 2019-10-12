import React, {
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { NavigationScreenProps } from 'react-navigation';
import {
  Text,
  Button,
  withSafeArea,
} from 'components';
import { palette } from 'constants/style';

const WebViewScreen: React.FunctionComponent<NavigationScreenProps> = ({
  navigation,
}) => {
  const source = useMemo(() => ({
    uri: navigation.state.params && navigation.state.params.url,
  }), [navigation]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View style={styles.container}>
      <WebView
        source={source}
        style={styles.webView}
      />
      <Button onPress={goBack}>
        <View style={styles.button}>
          <Text style={styles.text}>
            닫기
          </Text>
        </View>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    marginTop: -1,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: palette.gray[30],
    backgroundColor: palette.white.default,
  },
  text: {
    fontSize: 16,
    color: palette.gray[90],
    lineHeight: 24,
  },
});

export default withSafeArea(WebViewScreen);
