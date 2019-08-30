import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  StoryList,
} from 'components';
import { FETCH_MAIN_STORY_FEED } from 'graphqls';
import { isInitialLoading } from 'utils';

const EMPTY_LIST: Story[] = [];

type MainStoryFeedResult = {
  mainStoryFeed: {
    stories: Story[];
    cursor: string;
  };
};

const StoryListContainer: React.FunctionComponent<{}> = () => {
  const {
    data,
    networkStatus,
    error,
    fetchMore,
    refetch,
  } = useQuery<MainStoryFeedResult>(FETCH_MAIN_STORY_FEED, {
    notifyOnNetworkStatusChange: true,
  });

  if (error) {
    const reload = () => refetch().catch(() => {});
    return <ErrorView reload={reload} message={error.message} />;
  }

  if (isInitialLoading(networkStatus) || !data) {
    return <LoadingView dark />;
  }

  const {
    mainStoryFeed: {
      stories,
      cursor,
    },
  } = data;

  return (
    <StoryList
      items={stories || EMPTY_LIST}
      isLoading={networkStatus === NetworkStatus.fetchMore}
      hasBottom
      onFetchMore={() => fetchMore({
        variables: { cursor },
        updateQuery: (original, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return original;
          }

          const {
            mainStoryFeed: {
              stories: nextStories,
              cursor: nextCursor,
            },
          } = fetchMoreResult;

          return Object.assign(original, {
            mainStoryFeed: {
              ...original.mainStoryFeed,
              stories: original.mainStoryFeed.stories.concat(nextStories),
              cursor: nextCursor,
            },
          });
        },
      })}
    />
  );
};

export default React.memo(StoryListContainer);
