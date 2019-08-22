import React from 'react';
import {
  BottomTabBarProps,
  NavigationRoute,
  NavigationParams,
} from 'react-navigation';
import { BottomTabBar } from 'components';

interface Props extends BottomTabBarProps {
  onTabPress: ({ route }: { route: NavigationRoute<NavigationParams> }) => void;
}

const BottomTabBarContainer: React.FunctionComponent<Props> = (props) => (
  <BottomTabBar
    isLoggedIn={false}
    showAuthModal={() => {}}
    {...props}
  />
);

export default BottomTabBarContainer;
