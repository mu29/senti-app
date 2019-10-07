import React from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { CoinInventory } from 'components';
import {
  FETCH_PROFILE,
  SHOW_MODAL,
} from 'graphqls';

const Container: React.FunctionComponent<{}> = () => {
  const { data } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const [showModal] = useMutation(SHOW_MODAL, {
    variables: { id: 'Coin' },
  });

  if (!data || !data.me) {
    return null;
  }

  return (
    <CoinInventory
      amount={data.me.coin || 0}
      showModal={showModal}
    />
  );
};

export default React.memo(Container);
