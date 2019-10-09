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
  FETCH_MAIN_STORY_FEED,
  FETCH_MY_STORY_FEED,
} from 'graphqls';
import { AnalyticsService } from 'services';

type MainStoryFeedResult = {
  mainStoryFeed: {
    stories: Story[];
    cursor: string;
  };
};

type MyStoryFeedResult = {
  myStoryFeed: {
    stories: Story[];
    cursor: string;
  };
};

const Container: React.FunctionComponent<NavigationInjectedProps> = ({
  navigation,
}) => {
  const { data } = useQuery(FETCH_DRAFT);

  const [createStory] = useMutation(CREATE_STORY, {
    update: (cache, { data: { createStory: story } }) => {
      try {
        const savedMainFeed = cache.readQuery<MainStoryFeedResult>({
          query: FETCH_MAIN_STORY_FEED,
        });

        if (!savedMainFeed) {
          return;
        }

        cache.writeQuery({
          query: FETCH_MAIN_STORY_FEED,
          data: {
            mainStoryFeed: {
              ...savedMainFeed.mainStoryFeed,
              stories: [story, ...savedMainFeed.mainStoryFeed.stories],
            },
          },
        });
      } catch {}

      try {
        const savedMyFeed = cache.readQuery<MyStoryFeedResult>({
          query: FETCH_MY_STORY_FEED,
        });

        if (!savedMyFeed) {
          return;
        }

        cache.writeQuery({
          query: FETCH_MY_STORY_FEED,
          data: {
            myStoryFeed: {
              ...savedMyFeed.myStoryFeed,
              stories: [story, ...savedMyFeed.myStoryFeed.stories],
            },
          },
        });
      } catch {}
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const create = useCallback(async (audio) => {
    await createStory({
      variables: {
        input: {
          audio,
          cover: data.draft.cover,
          tags: data.draft.tags,
        },
      },
    });
    AnalyticsService.logEvent('finish_create_story');
  }, [createStory, data.draft]);

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
