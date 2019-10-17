import React from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { AuthModal } from 'components';
import { useAuth } from 'containers';
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

  if (!modal) {
    return null;
  }

  return (
    <AuthModal
      isVisible={modal.isVisible}
      provider={provider}
      signInWithFacebook={signInWithFacebook}
      signInWithGoogle={signInWithGoogle}
      hide={hideModal}
    />
  );
};

export default React.memo(Container);
