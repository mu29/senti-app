import React from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import ViewPager from '@react-native-community/viewpager';
import { Text, Button } from 'components';
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
const PLAY_ICON = { uri: 'ic_play_active' };
const CHAT_ICON = { uri: 'ic_chat_active' };

class MainTutorialLayer extends React.PureComponent {
  public static NAME = 'MainTutorialLayer';

  public render() {
    return (
      <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.container}>
        <View style={styles.header}>
          <Image source={LOGO_ICON} style={styles.logo} />
          <Text style={styles.title}>
            환영합니다.
          </Text>
          <Text style={styles.description}>
            센치는 글이 아닌 목소리로 대화하는{'\n'}익명 커뮤니티입니다.
          </Text>
        </View>
        <ViewPager style={styles.pager}>
          <View style={styles.page}>
            <Image source={PLAY_ICON} style={styles.icon} />
            <Text style={styles.description}>
              재생 버튼을 눌러 다른 사람의{'\n'}이야기를 들을 수 있습니다.
            </Text>
          </View>
          <View style={styles.page}>
            <Image source={CHAT_ICON} style={styles.icon} />
            <Text style={styles.description}>
              마음에 드는 이야기에는{'\n'}답장을 보내 보세요.
            </Text>
          </View>
        </ViewPager>
        <Button style={styles.button}>
          <Text style={typography.heading3}>
            다음
          </Text>
        </Button>
      </SafeAreaView>
    );
  }
}

MainTutorialLayer.NAME = 'MainTutorialLayer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: palette.transparent.black[60],
  },
  header: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  pager: {
    height: 200,
    paddingHorizontal: 48,
    paddingBottom: 48,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: palette.yellow.dark,
    marginBottom: 66,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignSelf: 'center',
  },
});

export default MainTutorialLayer;
