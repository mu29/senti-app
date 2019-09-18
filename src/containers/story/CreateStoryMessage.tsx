import React, { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { CreateStoryMessage } from 'components';
import { UPDATE_DRAFT } from 'graphqls';

const Container: React.FunctionComponent<{}> = () => {
  const [updateDraft] = useMutation(UPDATE_DRAFT);

  const updateMessage = useCallback((message: string) => {
    updateDraft({ variables: { message } });
  }, [updateDraft]);

  return (
    <CreateStoryMessage onChangeText={updateMessage} />
  );
};

export default React.memo(Container);
