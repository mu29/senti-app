import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { StoryList } from 'components';
import { FETCH_MAIN_STORY_FEED } from 'graphqls';

const StoryListContainer: React.FunctionComponent<{}> = () => {
  const {
    data,
    error,
    fetchMore,
  } = useQuery(FETCH_MAIN_STORY_FEED);

  if (error) {
    // TODO: 오류 메시지 표시 & Reload
    return null;
  }

  if (!data.mainStoryFeed) {
    return null;
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
