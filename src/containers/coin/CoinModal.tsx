import React from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { CoinModal } from 'components';
import {
  FETCH_MODAL,
  HIDE_MODAL,
} from 'graphqls';

const Container: React.FunctionComponent<{}> = () => {
  const { data } = useQuery(FETCH_MODAL, {
    variables: { id: 'Coin' },
  });

  const [hideModal] = useMutation(HIDE_MODAL, {
    variables: { id: 'Coin' },
  });

  if (!data || !data.modal) {
    return null;
  }

  return (
    <CoinModal
      isVisible={data.modal.isVisible}
      hide={hideModal}
    />
  );
};

export default React.memo(Container);
