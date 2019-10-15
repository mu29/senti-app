import React, { useMemo } from 'react';
import {
  NavigationRoute,
  NavigationParams,
} from 'react-navigation';
import { BottomTabBar as RNBottomTabBar } from 'react-navigation-tabs';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { BottomTabBar } from 'components';
import {
  SHOW_MODAL,
  FETCH_PROFILE,
} from 'graphqls';

type BottomTabBarProps = React.ComponentProps<typeof RNBottomTabBar>

interface Props {
  onTabPress: ({ route }: { route: NavigationRoute<NavigationParams> }) => void;
}

const BottomTabBarContainer: React.FunctionComponent<Props & BottomTabBarProps> = (props) => {
  const { data: profile } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const [showModal] = useMutation(SHOW_MODAL, {
    variables: { id: 'Auth' },
  });

  const badges = useMemo(() => ({
    3: profile && profile.me ? profile.me.badgeCount : 0,
  }), [profile]);

  return (
    <BottomTabBar
      isLoggedIn={!!(profile && profile.me)}
      badges={badges}
      showAuthModal={showModal}
      {...props}
    />
  );
};

export default React.memo(BottomTabBarContainer);
