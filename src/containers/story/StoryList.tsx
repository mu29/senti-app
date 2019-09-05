import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  StoryList,
} from 'components';
import { FETCH_MAIN_STORY_FEED } from 'graphqls';
import { canFetchMore } from 'utils';

const EMPTY_LIST: Story[] = [];

type MainStoryFeedResult = {
  mainStoryFeed: {
    stories: Story[];
    cursor: string;
  };
};

const Container: React.FunctionComponent<{}> = () => {
  const {
    data,
    networkStatus,
    error,
    fetchMore,
    refetch,
  } = useQuery<MainStoryFeedResult>(FETCH_MAIN_STORY_FEED, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  if (error || networkStatus === NetworkStatus.error) {
    const reload = () => refetch().catch(() => {});
    return <ErrorView reload={reload} message={error ? error.message : ''} />;
  }

  if (networkStatus === NetworkStatus.loading || !data || !data.mainStoryFeed) {
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
      isRefreshing={networkStatus === NetworkStatus.refetch}
      onRefresh={refetch}
      hasBottom
      onFetchMore={() => canFetchMore(networkStatus, error) && fetchMore({
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

          if (nextStories.length === 0) {
            return original;
          }

          return Object.assign(original, {
            mainStoryFeed: {
              ...original.mainStoryFeed,
              stories: original.mainStoryFeed.stories.concat(nextStories),
              cursor: nextCursor,
            },
          });
        },
      }).catch(() => {})}
    />
  );
};

export default React.memo(Container);
