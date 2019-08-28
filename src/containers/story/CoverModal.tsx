import React, { useCallback } from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
} from '@apollo/react-hooks';
import { CoverModal } from 'components';
import {
  FETCH_COVERS,
  FETCH_MODAL,
  HIDE_MODAL,
} from 'graphqls';

type CoversResult = {
  covers: string[];
};

const CoverModalContainer: React.FunctionComponent<{}> = () => {
  const {
    data: {
      covers,
    },
  } = useQuery(FETCH_COVERS) as { data: CoversResult };

  const { data } = useQuery(FETCH_MODAL, {
    variables: { id: 'Cover' },
  });

  const [hideModal] = useMutation(HIDE_MODAL, {
    variables: { id: 'Cover' },
  });

  const client = useApolloClient();

  const updateCover = useCallback((cover: string) => {
    client.writeData({ data: { cover } });
  }, []);

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
