import React, { useMemo } from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { NewBottomTabBar } from 'components';
import {
  SHOW_MODAL,
  FETCH_PROFILE,
} from 'graphqls';

interface Props {
  index: number;
  setPage: (index: number) => void;
}

const Container: React.FunctionComponent<Props> = (props) => {
  const {
    data: {
      profile,
    } = {
      profile: undefined,
    },
  } = useQuery<{ profile: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const [showModal] = useMutation(SHOW_MODAL, {
    variables: { id: 'Auth' },
  });

  const badges = useMemo(() => ({
    0: profile ? profile.badgeCount : 0,
  }), [profile]);

  return (
    <NewBottomTabBar
      isLoggedIn={!!profile}
      badges={badges}
      showAuthModal={showModal}
      {...props}
    />
  );
};

export default React.memo(Container);
