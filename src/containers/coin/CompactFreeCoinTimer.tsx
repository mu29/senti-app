import React from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { CompactFreeCoinTimer } from 'components';
import {
  FETCH_PROFILE,
  SHOW_MODAL,
} from 'graphqls';

const Container: React.FunctionComponent<{}> = () => {
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
    variables: { id: 'Coin' },
  });

  if (!profile) {
    return null;
  }

  return (
    <CompactFreeCoinTimer
      canUseFreeCoinAt={profile.canUseFreeCoinAt || 0}
      showModal={showModal}
    />
  );
};

export default React.memo(Container);
