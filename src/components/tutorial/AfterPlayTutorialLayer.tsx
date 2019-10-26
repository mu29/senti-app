import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import {
  Text,
  Button,
  Portal,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'always',
  bottom: 'always',
};

const LOGO_ICON = { uri: 'ic_splash' };
const ADD_ICON = { uri: 'ic_add_active' };

class AfterPlayTutorialLayer extends React.PureComponent {
  public static NAME = 'AfterPlayTutorialLayer';

  public render() {
    return (
      <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.container}>
        <View style={styles.header}>
          <Image source={LOGO_ICON} style={styles.logo} />
          <Text style={styles.title}>
            잘 하셨어요!
          </Text>
          <Text style={styles.description}>
            이야기를 하나 들었으니,{'\n'}이번엔 내 목소리를 올려 볼까요?
          </Text>
        </View>
        <View style={styles.page}>
          <Image source={ADD_ICON} style={styles.icon} />
          <Text style={styles.description}>
            추가 버튼을 눌러 목소리를 녹음하고,{'\n'}새로운 이야기를 올릴 수 있습니다.
          </Text>
        </View>
        <Button onPress={this.hide} style={styles.button}>
          <Text style={styles.text}>
            시작하기
          </Text>
        </Button>
      </SafeAreaView>
    );
  }

  private hide = () => {
    Portal.hide(AfterPlayTutorialLayer);
  }
}

AfterPlayTutorialLayer.NAME = 'AfterPlayTutorialLayer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: palette.transparent.black[80],
  },
  header: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    paddingHorizontal: 48,
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 24,
  },
  title: {
    ...typography.heading1,
    marginBottom: 12,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: palette.gray[10],
    marginBottom: 12,
  },
  description: {
    ...typography.body1,
    textAlign: 'center',
  },
  button: {
    width: 128,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: Platform.select({
      ios: 2,
      android: 0,
    }),
    borderRadius: 24,
    backgroundColor: palette.yellow.default,
  },
  text: {
    ...typography.heading3,
    color: palette.black.default,
  },
});

export default AfterPlayTutorialLayer;
