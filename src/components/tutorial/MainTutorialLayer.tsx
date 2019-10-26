import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import ViewPager, {
  ViewPagerOnPageSelectedEventData,
} from '@react-native-community/viewpager';
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
const PLAY_ICON = { uri: 'ic_play_active' };
const NEXT_ICON = { uri: 'ic_next' };
const CHAT_ICON = { uri: 'ic_chat_active' };

const DONE_INDEX = 2;

interface State {
  index: number;
}

class MainTutorialLayer extends React.PureComponent<{}, State> {
  public static NAME = 'MainTutorialLayer';

  public state = {
    index: 0,
  };

  private pagerRef = React.createRef<ViewPager>();

  public render() {
    const { index } = this.state;

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
        <ViewPager
          ref={this.pagerRef}
          onPageSelected={this.onPageSelected}
          style={styles.pager}
          scrollEnabled={false}
          pointerEvents="none"
        >
          <View style={styles.page}>
            <Image source={PLAY_ICON} style={styles.icon} />
            <Text style={styles.description}>
              재생 버튼을 눌러 다른 사람의{'\n'}이야기를 들을 수 있습니다.
            </Text>
          </View>
          <View style={styles.page}>
            <Image source={NEXT_ICON} style={styles.icon} />
            <Text style={styles.description}>
              위아래로 스크롤하거나, 버튼을 눌러{'\n'}다음 이야기로 이동할 수 있습니다.
            </Text>
          </View>
          <View style={styles.page}>
            <Image source={CHAT_ICON} style={styles.icon} />
            <Text style={styles.description}>
              마음에 드는 이야기에는{'\n'}답장을 보내 보세요.
            </Text>
          </View>
        </ViewPager>
        <Button onPress={this.showNext} style={[styles.button, index === DONE_INDEX && styles.doneButton]}>
          <Text style={[typography.heading3, index === DONE_INDEX && styles.doneText]}>
            {index === DONE_INDEX ? '시작하기' : '다음'}
          </Text>
        </Button>
      </SafeAreaView>
    );
  }

  private showNext = () => {
    const { index } = this.state;

    if (index < DONE_INDEX) {
      this.pagerRef.current && this.pagerRef.current.setPage(index + 1);
      return;
    }

    Portal.hide(MainTutorialLayer);
  }

  private onPageSelected = ({ nativeEvent }: NativeSyntheticEvent<ViewPagerOnPageSelectedEventData>) => {
    this.setState({ index: nativeEvent.position });
  }
}

MainTutorialLayer.NAME = 'MainTutorialLayer';

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
    backgroundColor: palette.gray[80],
  },
  doneText: {
    color: palette.black.default,
  },
  doneButton: {
    backgroundColor: palette.yellow.default,
  },
});

export default MainTutorialLayer;
