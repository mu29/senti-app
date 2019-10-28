import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import uniqBy from 'lodash/uniqBy';
import {
  ErrorView,
  LoadingView,
  StoryList,
} from 'components';
import { FETCH_TAG_STORY_FEED } from 'graphqls';
import {
  isFetching,
  canFetchMore,
} from 'utils';

const EMPTY_LIST: Story[] = [];

type TagStoryFeedResult = {
  tagStoryFeed: {
    stories: Story[];
    cursor: string;
  };
};

interface Props {
  tagId: string;
}

const Container: React.FunctionComponent<Props> = ({
  tagId,
}) => {
  const {
    data: {
      tagStoryFeed,
    } = {
      tagStoryFeed: undefined,
    },
    networkStatus,
    error,
    fetchMore,
    refetch,
  } = useQuery<TagStoryFeedResult>(FETCH_TAG_STORY_FEED, {
    variables: {
      tagId,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  if (error || networkStatus === NetworkStatus.error) {
    const reload = () => refetch().catch(console.error);
    return <ErrorView reload={reload} message={error ? error.message : ''} />;
  }

  if (networkStatus === NetworkStatus.loading || !tagStoryFeed) {
    return <LoadingView dark />;
  }

  const {
    stories,
    cursor,
  } = tagStoryFeed;

  return (
    <StoryList
      items={stories || EMPTY_LIST}
      isLoading={isFetching(networkStatus)}
      isRefreshing={networkStatus === NetworkStatus.refetch}
      onRefresh={refetch}
      onFetchMore={() => canFetchMore(networkStatus, error) && fetchMore({
        variables: {
          tagId,
          cursor,
        },
        updateQuery: (original, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return original;
          }

          const {
            tagStoryFeed: {
              stories: nextStories,
              cursor: nextCursor,
            },
          } = fetchMoreResult;

          if (nextStories.length === 0) {
            return original;
          }

          return {
            ...original,
            tagStoryFeed: {
              ...original.tagStoryFeed,
              stories: uniqBy([...original.tagStoryFeed.stories, ...nextStories], 'id'),
              cursor: nextCursor,
            },
          };
        },
      }).catch(console.error)}
    />
  );
};

export default React.memo(Container);
