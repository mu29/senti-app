import React from 'react';
import {
  useMutation,
  useQuery,
} from '@apollo/react-hooks';
import { AuthModal } from 'components';
import { useAuth } from 'services';
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

  const {
    provider,
    signInWithFacebook,
    signInWithGoogle,
  } = useAuth(hideModal);

  if (!data || !data.modal) {
    return null;
  }

  return (
    <AuthModal
      isVisible={data.modal.isVisible}
      provider={provider}
      signInWithFacebook={signInWithFacebook}
      signInWithGoogle={signInWithGoogle}
      hide={hideModal}
    />
  );
};

export default React.memo(AuthModalContainer);
