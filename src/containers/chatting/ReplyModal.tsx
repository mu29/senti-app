import React from 'react';
import {
  useMutation,
  useQuery,
} from '@apollo/react-hooks';
import { ReplyModal } from 'components';
import {
  FETCH_MODAL,
  HIDE_MODAL,
} from 'graphqls';

const ReplyModalContainer: React.FunctionComponent<{}> = () => {
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
    <ReplyModal
      isVisible={data.modal.isVisible}
      isLoading={false}
      hide={hideModal}
      create={(_path: string, _duration: number) => Promise.resolve()}
    />
  );
};

export default React.memo(ReplyModalContainer);