import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  StoryList,
} from 'components';
import { FETCH_MAIN_STORY_FEED } from 'graphqls';

const StoryListContainer: React.FunctionComponent<{}> = () => {
  const {
    data,
    loading,
    error,
    fetchMore,
    refetch,
  } = useQuery(FETCH_MAIN_STORY_FEED);

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    const reload = () => refetch().catch(() => {});
    return <ErrorView reload={reload} message={error.message} />;
  }

  const {
    mainStoryFeed: {
      stories,
      cursor,
    },
  } = data;

  return (
    <StoryList
      stories={stories || []}
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
