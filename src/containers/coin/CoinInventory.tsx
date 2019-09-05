import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { CoinInventory } from 'components';
import { SHOW_MODAL } from 'graphqls';

const Container: React.FunctionComponent<{}> = () => {
  const [showModal] = useMutation(SHOW_MODAL, {
    variables: { id: 'Coin' },
  });

  return (
    <CoinInventory
      amount={16}
      showModal={showModal}
    />
  );
};

export default React.memo(Container);
