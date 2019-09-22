import React, { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { CreateStoryTags } from 'components';
import { UPDATE_DRAFT } from 'graphqls';

const Container: React.FunctionComponent<{}> = () => {
  const [updateDraft] = useMutation(UPDATE_DRAFT);

  const updateTags = useCallback((tags: string[]) => {
    updateDraft({ variables: { tags } });
  }, [updateDraft]);

  return (
    <CreateStoryTags updateTags={updateTags} />
  );
};

export default React.memo(Container);
