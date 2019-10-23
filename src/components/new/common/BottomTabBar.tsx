import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Platform,
  Keyboard,
} from 'react-native';
import {
  withNavigation,
  NavigationInjectedProps,
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import { useAnimation } from 'react-native-animation-hooks';
import {
  Button,
  Badge,
} from 'components';
import { palette } from 'constants/style';

const AnimatedButton = Animated.createAnimatedComponent(Button);

const HOME_ICON = { uri: 'ic_home' };
const ADD_ICON = { uri: 'ic_add_active' };

const CHAT_ICON = { uri: 'ic_chat' };
const CHAT_ICON_ACTIVE = { uri: 'ic_chat_active' };

const PROFILE_ICON = { uri: 'ic_profile' };
const PROFILE_ICON_ACTIVE = { uri: 'ic_profile_active' };

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'never',
  bottom: 'always',
};

interface Props extends NavigationInjectedProps {
  index: number;
  isLoggedIn: boolean;
  badges: Record<number, number>,
  setPage: (index: number) => void;
  showAuthModal: () => void;
}

const BottomTabBar: React.FunctionComponent<Props> = ({
  index,
  isLoggedIn,
  badges,
  setPage,
  showAuthModal,
  navigation,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [current, setCurrent] = useState(index);

  const buttonAnimation = useAnimation({
    type: 'timing',
    toValue: Number(current === 1),
    duration: 200,
    useNativeDriver: true,
  });

  const homeButtonStyle = useMemo(() => ({
    opacity: buttonAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.01],
      extrapolate: 'clamp',
    }),
    transform: [{
      scale: buttonAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.01],
        extrapolate: 'clamp',
      }),
    }],
  }), [buttonAnimation]);

  const addButtonStyle = useMemo(() => ({
    opacity: buttonAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.01, 1],
      extrapolate: 'clamp',
    }),
    transform: [{
      scale: buttonAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.01, 1],
        extrapolate: 'clamp',
      }),
    }],
  }), [buttonAnimation]);

  const onPressChat = useCallback(() => {
    if (!isLoggedIn) {
      showAuthModal();
      return;
    }

    setPage(0);
    setCurrent(0);
  }, [setPage, isLoggedIn, showAuthModal]);

  const onPressHome = useCallback(() => {
    setPage(1);
    setCurrent(1);
  }, [setPage]);

  const onPressProfile = useCallback(() => {
    if (!isLoggedIn) {
      showAuthModal();
      return;
    }

    setPage(2);
    setCurrent(2);
  }, [setPage, isLoggedIn, showAuthModal]);

  const onPressAdd = useCallback(() => navigation.navigate('Add'), [navigation]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const onKeyboardDidShow = () => setIsVisible(false);
    const onKeyboardDidHide = () => setIsVisible(true);

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return () => {
      keyboardDidShowListener && keyboardDidShowListener.remove();
      keyboardDidHideListener && keyboardDidHideListener.remove();
    }
  }, [setIsVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.container}>
      <View style={styles.content}>
        <Button onPress={onPressChat} style={styles.button} round>
          <Image source={current === 0 ? CHAT_ICON_ACTIVE : CHAT_ICON} style={styles.icon} />
          {badges[0] ? (<Badge count={badges[0]} />) : null}
        </Button>
        <View style={styles.button}>
          <AnimatedButton onPress={onPressHome} style={[styles.nestedButton, homeButtonStyle]} round>
            <Image source={HOME_ICON} style={styles.icon} />
          </AnimatedButton>
          <AnimatedButton onPress={onPressAdd} style={[styles.nestedButton, addButtonStyle]} round>
            <Image source={ADD_ICON} style={styles.icon} />
          </AnimatedButton>
        </View>
        <Button onPress={onPressProfile} style={styles.button} round>
          <Image source={current === 2 ? PROFILE_ICON_ACTIVE : PROFILE_ICON} style={styles.icon} />
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.000001)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 200,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: palette.gray[90],
    borderRadius: 32,
    shadowColor: palette.black.default,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 6,
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nestedButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: palette.gray[10],
  },
});

export default withNavigation(React.memo(BottomTabBar));
