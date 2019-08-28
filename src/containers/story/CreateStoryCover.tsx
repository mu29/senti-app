import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { CreateStoryCover } from 'components';
import { FETCH_RANDOM_COVER } from 'graphqls';

type RandomCoverResult = {
  randomCover: string;
};

const CreateStoryCoverContainer: React.FunctionComponent<{}> = () => {
  const { data } = useQuery<RandomCoverResult>(FETCH_RANDOM_COVER);

  if (!data || !data.randomCover) {
    return null;
  }

  return (
    <CreateStoryCover cover={data.randomCover} />
  );
};

export default React.memo(CreateStoryCoverContainer);
