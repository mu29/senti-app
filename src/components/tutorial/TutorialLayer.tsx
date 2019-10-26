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

interface Props {
  title: string;
  description: string;
  steps: Array<{
    icon: string;
    message: string;
  }>;
}

interface State {
  index: number;
  maxIndex: number;
}

class TutorialLayer extends React.PureComponent<Props, State> {
  public static NAME = 'TutorialLayer';

  private pagerRef = React.createRef<ViewPager>();

  constructor(props: Props) {
    super(props);
    this.state = {
      index: 0,
      maxIndex: props.steps.length - 1,
    };
  }

  public render() {
    const {
      title,
      description,
      steps,
    } = this.props;
    const {
      index,
      maxIndex,
    } = this.state;

    return (
      <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.container}>
        <View style={styles.header}>
          <Image source={LOGO_ICON} style={styles.logo} />
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.description}>
            {description}
          </Text>
        </View>
        <ViewPager
          ref={this.pagerRef}
          onPageSelected={this.onPageSelected}
          style={styles.pager}
          scrollEnabled={false}
          pointerEvents="none"
        >
          {steps.map(({ icon, message }) => (
            <View key={icon} style={styles.page}>
              <Image source={{ uri: icon }} style={styles.icon} />
              <Text style={styles.description}>
                {message}
              </Text>
            </View>
          ))}
        </ViewPager>
        <Button onPress={this.showNext} style={[styles.button, index === maxIndex && styles.doneButton]}>
          <Text style={[typography.heading3, index === maxIndex && styles.doneText]}>
            {index === maxIndex ? '시작하기' : '다음'}
          </Text>
        </Button>
      </SafeAreaView>
    );
  }

  private showNext = () => {
    const {
      index,
      maxIndex,
    } = this.state;

    if (index < maxIndex) {
      this.pagerRef.current && this.pagerRef.current.setPage(index + 1);
      return;
    }

    Portal.hide(TutorialLayer);
  }

  private onPageSelected = ({ nativeEvent }: NativeSyntheticEvent<ViewPagerOnPageSelectedEventData>) => {
    this.setState({ index: nativeEvent.position });
  }
}

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

export default TutorialLayer;
