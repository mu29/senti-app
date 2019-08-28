import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { CreateStoryHeader } from 'components';
import { SHOW_MODAL } from 'graphqls';

const Container: React.FunctionComponent<{}> = () => {
  const [showCoverModal] = useMutation(SHOW_MODAL, {
    variables: { id: 'Cover' },
  });

  return (
    <CreateStoryHeader showCoverModal={showCoverModal} />
  );
};

export default React.memo(Container);
