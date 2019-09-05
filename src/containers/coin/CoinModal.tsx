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
    variables: { id: 'Reply' },
  });

  const [hideModal] = useMutation(HIDE_MODAL, {
    variables: { id: 'Reply' },
  });

  if (!data || !data.modal) {
    return null;
  }

  return (
    <CoinModal
      isVisible={data.modal.isVisible}
      isLoading={false}
      hide={hideModal}
    />
  );
};

export default React.memo(Container);
