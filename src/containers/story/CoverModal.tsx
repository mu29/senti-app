import React, { useCallback } from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { CoverModal } from 'components';
import {
  FETCH_MODAL,
  UPDATE_DRAFT,
  HIDE_MODAL,
} from 'graphqls';
import covers from 'constants/covers';

const CoverModalContainer: React.FunctionComponent<{}> = () => {
  const { data } = useQuery(FETCH_MODAL, {
    variables: { id: 'Cover' },
  });

  const [hideModal] = useMutation(HIDE_MODAL, {
    variables: { id: 'Cover' },
  });

  const [updateDraft] = useMutation(UPDATE_DRAFT);

  const updateCover = useCallback((cover: string) => {
    updateDraft({ variables: { cover } });
  }, [updateDraft]);

  if (!data || !data.modal) {
    return null;
  }

  return (
    <CoverModal
      isVisible={data.modal.isVisible}
      items={covers}
      updateCover={updateCover}
      hide={hideModal}
    />
  );
};

export default React.memo(CoverModalContainer);
