import React from 'react';
import {
  BottomTabBarProps,
  NavigationRoute,
  NavigationParams,
} from 'react-navigation';
import { useMutation } from '@apollo/react-hooks';
import { BottomTabBar } from 'components';
import { useAuth } from 'services';
import { SHOW_MODAL } from 'graphqls';

interface Props extends BottomTabBarProps {
  onTabPress: ({ route }: { route: NavigationRoute<NavigationParams> }) => void;
}

const BottomTabBarContainer: React.FunctionComponent<Props> = (props) => {
  const { user } = useAuth();

  const [showModal] = useMutation(SHOW_MODAL, {
    variables: { id: 'Auth' },
  });

  return (
    <BottomTabBar
      isLoggedIn={!!user}
      showAuthModal={showModal}
      {...props}
    />
  );
};

export default React.memo(BottomTabBarContainer);
