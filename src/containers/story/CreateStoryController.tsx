import React, {
  useState,
  useCallback,
} from 'react';
import {
  withNavigation,
  NavigationInjectedProps,
} from 'react-navigation';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { LoadingLayer } from 'components';
import { RecordController } from 'containers';
import {
  FETCH_DRAFT,
  CREATE_STORY,
} from 'graphqls';
import { AnalyticsService } from 'services';

const Container: React.FunctionComponent<NavigationInjectedProps> = ({
  navigation,
}) => {
  const { data } = useQuery(FETCH_DRAFT);

  const [createStory] = useMutation(CREATE_STORY);

  const [isLoading, setIsLoading] = useState(false);

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
    AnalyticsService.logEvent('finish_create_story');
  }, [createStory, data.draft.cover, data.draft.message]);

  const finish = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <React.Fragment>
      <RecordController
        setIsLoading={setIsLoading}
        onCreate={create}
        onFinish={finish}
      />
      {isLoading && <LoadingLayer />}
    </React.Fragment>
  );
};

export default withNavigation(React.memo(Container));
