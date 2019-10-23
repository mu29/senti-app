import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  EmitterSubscription,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
  NavigationRoute,
  NavigationParams,
} from 'react-navigation';
import { BottomTabBar as RNBottomTabBar } from 'react-navigation-tabs';
import { Badge } from 'components';
import { palette } from 'constants/style';

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'never',
  bottom: 'always',
};

type BottomTabBarProps = React.ComponentProps<typeof RNBottomTabBar>

interface Props {
  isLoggedIn: boolean;
  badges: Record<number, number>,
  onTabPress: ({ route }: { route: NavigationRoute<NavigationParams> }) => void;
  showAuthModal: () => void;
}

class BottomTabBar extends React.PureComponent<Props & BottomTabBarProps> {
  public state = {
    isVisible: true,
  };

  private onPressHandlers: {
    [key: string]: () => void;
  } = {};

  private keyboardDidShowListener?: EmitterSubscription;

  private keyboardDidHideListener?: EmitterSubscription;

  public componentDidMount() {
    if (Platform.OS === 'android') {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this.onKeyboardDidShow,
      );

      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this.onKeyboardDidHide,
      );
    }
  }

  public componentWillUnmount() {
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }
  }

  public render() {
    if (!this.state.isVisible) {
      return null;
    }

    const {
      navigation: {
        state: {
          routes,
        },
      },
    } = this.props;

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={SAFE_AREA_INSET}
      >
        {routes.map(this.renderTabItem)}
      </SafeAreaView>
    );
  }

  private renderTabItem = (route: NavigationRoute<NavigationParams>, index: number) => {
    const {
      navigation: {
        state: {
          index: navigationIndex,
        },
      },
      badges,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
    } = this.props;

    return (
      <TouchableOpacity
        key={route.key}
        style={styles.menu}
        activeOpacity={1}
        onPress={this.getOnPressHandler(route)}
      >
        {badges[index] ? (<Badge count={badges[index]} />) : null}
        {renderIcon({
          route,
          index: index,
          focused: navigationIndex === index,
          // @ts-ignore
          tintColor: navigationIndex === index ? activeTintColor : inactiveTintColor,
        })}
      </TouchableOpacity>
    );
  }

  private getOnPressHandler = (route: NavigationRoute<NavigationParams>) => {
    if (!Object.prototype.hasOwnProperty.call(this.onPressHandlers, route.key)) {
      this.onPressHandlers[route.key] = () => {
        const { params = {} } = route;
        const {
          isLoggedIn,
          showAuthModal,
          onTabPress,
        } = this.props;

        if (params.private && !isLoggedIn) {
          showAuthModal();
          return;
        }

        onTabPress({ route });
      };
    }

    return this.onPressHandlers[route.key];
  }

  private onKeyboardDidShow = () => this.setState({ isVisible: false });

  private onKeyboardDidHide = () => this.setState({ isVisible: true });
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: 'row',
    backgroundColor: palette.black.default,
  },
  menu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabBar;
