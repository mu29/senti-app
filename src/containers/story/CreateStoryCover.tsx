import React, { useEffect } from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { CreateStoryCover } from 'components';
import {
  FETCH_DRAFT,
  SHUFFLE_COVERS,
} from 'graphqls';

type DraftResult = {
  draft: Draft;
};

const Container: React.FunctionComponent<{}> = () => {
  const { data } = useQuery(FETCH_DRAFT) as { data: DraftResult };

  const [shuffleCovers] = useMutation(SHUFFLE_COVERS);

  useEffect(() => {
    shuffleCovers();
  }, [shuffleCovers]);

  if (!data.draft.cover) {
    return null;
  }

  return (
    <CreateStoryCover cover={data.draft.cover} />
  );
};

export default React.memo(Container);
