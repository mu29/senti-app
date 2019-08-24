import React from 'react';
import {
  useMutation,
  useQuery,
} from '@apollo/react-hooks';
import { AuthModal } from 'components';
import {
  FETCH_MODAL,
  HIDE_MODAL,
} from 'graphqls';

const AuthModalContainer: React.FunctionComponent<{}> = () => {
  const { data } = useQuery(FETCH_MODAL, {
    variables: { id: 'Auth' },
  });

  const [hideModal] = useMutation(HIDE_MODAL, {
    variables: { id: 'Auth' },
  });

  if (!data || !data.modal) {
    return null;
  }

  return (
    <AuthModal
      isVisible={data.modal.isVisible}
      provider={undefined}
      signInWithFacebook={() => {}}
      signInWithGoogle={() => {}}
      hide={hideModal}
    />
  );
};

export default AuthModalContainer;
