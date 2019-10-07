import React from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { StoryController } from 'components';
import {
  SHOW_MODAL,
  FETCH_PROFILE,
  REPORT_USER,
  DELETE_STORY,
  FETCH_MAIN_STORY_FEED,
  FETCH_MY_STORY_FEED,
} from 'graphqls';

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

interface Props {
  item: Story;
  hasBottom?: boolean;
}

const StoryControllerContainer: React.FunctionComponent<Props> = ({
  item,
  ...props
}) => {
  const { data: profile } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const [showAuthModal] = useMutation(SHOW_MODAL, {
    variables: { id: 'Auth' },
  });

  const [showReplyModal] = useMutation(SHOW_MODAL, {
    variables: {
      id: 'Reply',
      params: JSON.stringify({
        id: item.id,
      }),
    },
  });

  const [reportUser, { loading: reportLoading }] = useMutation(REPORT_USER, {
    variables: {
      id: item.user.id,
      storyId: item.id,
      audioUrl: item.audio.url,
    },
    update: (cache) => {
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
              stories: savedMainFeed.mainStoryFeed.stories.filter(story => story.user.id !== item.user.id),
            },
          },
        });
      } catch {}
    },
  });

  const [deleteStory, { loading: deleteLoading }] = useMutation(DELETE_STORY, {
    variables: {
      id: item.id,
    },
    update: (cache) => {
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
              stories: savedMainFeed.mainStoryFeed.stories.filter(story => story.id !== item.id),
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
              stories: savedMyFeed.myStoryFeed.stories.filter(story => story.id !== item.id),
            },
          },
        });
      } catch {}
    },
  });

  const isLoggedIn = !!(profile && profile.me);
  const isMyStory = isLoggedIn && profile!.me.id === item.user.id;

  return (
    <StoryController
      item={item}
      isLoggedIn={isLoggedIn}
      isMyStory={isMyStory}
      isLoading={reportLoading || deleteLoading}
      showAuthModal={showAuthModal}
      showReplyModal={showReplyModal}
      reportUser={reportUser}
      deleteStory={deleteStory}
      {...props}
    />
  );
};

export default React.memo(StoryControllerContainer);
