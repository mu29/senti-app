import React, { useCallback } from 'react';
import {
  withNavigation,
  NavigationInjectedProps,
} from 'react-navigation';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { RecordController } from 'containers';
import {
  FETCH_DRAFT,
  CREATE_STORY,
} from 'graphqls';

const Container: React.FunctionComponent<NavigationInjectedProps> = ({
  navigation,
}) => {
  const { data } = useQuery(FETCH_DRAFT);

  const [createStory] = useMutation(CREATE_STORY);

  const create = useCallback(async (audio) => {
    await createStory({
      variables: {
        input: {
          audio,
          cover: data.draft.cover,
          message: data.draft.message,
        },
      },
    });
  }, [data]);

  const finish = useCallback(() => navigation.goBack(), []);

  return (
    <RecordController onCreate={create} onFinish={finish} />
  );
};

export default withNavigation(React.memo(Container));
