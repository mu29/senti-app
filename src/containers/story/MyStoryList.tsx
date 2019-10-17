import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  StoryList,
} from 'components';
import { FETCH_MY_STORY_FEED } from 'graphqls';
import { canFetchMore } from 'utils';

const EMPTY_LIST: Story[] = [];

type MyStoryFeedResult = {
  myStoryFeed: {
    stories: Story[];
    cursor: string;
  };
};

interface Props {
  initialIndex: number;
}

const Container: React.FunctionComponent<Props> = (props) => {
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
    notifyOnNetworkStatusChange: true,
  });

  if (error || networkStatus === NetworkStatus.error) {
    const reload = () => refetch().catch(console.error);
    return <ErrorView reload={reload} message={error ? error.message : ''} />;
  }

  if (networkStatus === NetworkStatus.loading || !myStoryFeed) {
    return <LoadingView dark />;
  }

  const {
    stories,
    cursor,
  } = myStoryFeed;

  return (
    <StoryList
      items={stories || EMPTY_LIST}
      isLoading={networkStatus === NetworkStatus.fetchMore}
      isRefreshing={networkStatus === NetworkStatus.refetch}
      onRefresh={refetch}
      onFetchMore={() => canFetchMore(networkStatus, error) && fetchMore({
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
      {...props}
    />
  );
};

export default React.memo(Container);
