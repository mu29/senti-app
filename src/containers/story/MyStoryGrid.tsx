import React, { useState } from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  StoryGrid,
  StoryEmptyList,
} from 'components';
import { FETCH_MY_STORY_FEED } from 'graphqls';
import {
  isFetching,
  canFetchMore,
} from 'utils';

const EMPTY_LIST: Story[] = [];

type MyStoryFeedResult = {
  myStoryFeed: {
    stories: Story[];
    cursor: string;
  };
};

const Container: React.FunctionComponent<{}> = () => {
  const [hasEndReached, setHasEndReached] = useState(false);

  const {
    data: {
      myStoryFeed,
    } = {
      myStoryFeed: undefined,
    },
    networkStatus,
    error,
    fetchMore,
    refetch,
  } = useQuery<MyStoryFeedResult>(FETCH_MY_STORY_FEED, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  if (error || networkStatus === NetworkStatus.error) {
    const reload = () => refetch().catch(console.error);
    return <ErrorView reload={reload} message={error ? error.message : ''} />;
  }

  if (!myStoryFeed) {
    return <LoadingView />;
  }

  const {
    stories,
    cursor,
  } = myStoryFeed;

  if (stories.length === 0) {
    return <StoryEmptyList />;
  }

  return (
    <StoryGrid
      items={stories || EMPTY_LIST}
      isLoading={isFetching(networkStatus)}
      isRefreshing={networkStatus === NetworkStatus.refetch}
      onRefresh={refetch}
      onFetchMore={() => !hasEndReached && canFetchMore(networkStatus, error) && fetchMore({
        variables: { cursor },
        updateQuery: (original, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return original;
          }

          const {
            myStoryFeed: {
              stories: nextStories,
              cursor: nextCursor,
            },
          } = fetchMoreResult;

          if (nextCursor === original.myStoryFeed.cursor) {
            setHasEndReached(true);
          }

          if (nextStories.length === 0) {
            return original;
          }

          return Object.assign(original, {
            myStoryFeed: {
              ...original.myStoryFeed,
              stories: original.myStoryFeed.stories.concat(nextStories),
              cursor: nextCursor,
            },
          });
        },
      }).catch(console.error)}
    />
  );
};

export default React.memo(Container);
