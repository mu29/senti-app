import React, { useCallback } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { StoryList } from 'components';
import { FETCH_MAIN_STORY_FEED } from 'graphqls';

const StoryListContainer: React.FunctionComponent<{}> = () => {
  const {
    data,
    error,
    fetchMore,
  } = useQuery(FETCH_MAIN_STORY_FEED);

  const onFetchMore = useCallback(() => fetchMore({
    variables: {
      cursor: data.cursor,
    },
    updateQuery: (original, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return original;
      }

      return Object.assign(original, {
        stories: original.stories.concat(fetchMoreResult.stories),
        cursor: fetchMoreResult.cursor,
      });
    },
  }), [data.cursor]);

  if (error) {
    // TODO: 오류 메시지 표시 & Reload
    return null;
  }

  return (
    <StoryList
      stories={data.stories || []}
      onFetchMore={onFetchMore}
    />
  );
};

export default React.memo(StoryListContainer);
