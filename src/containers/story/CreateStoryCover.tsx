import React, { useEffect } from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { CreateStoryCover } from 'components';
import {
  FETCH_COVER,
  SHUFFLE_COVERS,
} from 'graphqls';

type CoverResult = {
  cover: string;
};

const CreateStoryCoverContainer: React.FunctionComponent<{}> = () => {
  const { data } = useQuery(FETCH_COVER) as { data: CoverResult };

  const [shuffleCovers] = useMutation(SHUFFLE_COVERS);

  useEffect(() => {
    shuffleCovers();
  }, []);

  if (!data.cover) {
    return null;
  }

  return (
    <CreateStoryCover cover={data.cover} />
  );
};

export default React.memo(CreateStoryCoverContainer);
