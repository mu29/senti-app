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
  const {
    data: {
      modal,
    } = {
      modal: undefined,
    },
  } = useQuery<{ modal: Modal }>(FETCH_MODAL, {
    variables: { id: 'Coin' },
  });

  const [hideModal] = useMutation(HIDE_MODAL, {
    variables: { id: 'Coin' },
  });

  if (!modal) {
    return null;
  }

  return (
    <CoinModal
      isVisible={modal.isVisible}
      hide={hideModal}
    />
  );
};

export default React.memo(Container);
