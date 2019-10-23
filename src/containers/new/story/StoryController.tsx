import React from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { NewStoryController } from 'components';
import {
  SHOW_MODAL,
  FETCH_PROFILE,
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

const Container: React.FunctionComponent<Props> = ({
  item,
  ...props
}) => {
  const {
    data: {
      profile,
    } = {
      profile: undefined,
    },
  } = useQuery<{ profile: Profile }>(FETCH_PROFILE, {
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

  const [deleteStory] = useMutation(DELETE_STORY, {
    variables: {
      id: item.id,
    },
    update: (cache) => {
      try {
        const data = cache.readQuery<MainStoryFeedResult>({
          query: FETCH_MAIN_STORY_FEED,
        });

        if (!data) {
          return;
        }

        cache.writeQuery({
          query: FETCH_MAIN_STORY_FEED,
          data: {
            mainStoryFeed: {
              ...data.mainStoryFeed,
              stories: data.mainStoryFeed.stories.filter(story => story.id !== item.id),
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

  const isMyStory = profile ? profile.id === item.user.id : false;

  return (
    <NewStoryController
      item={item}
      isLoggedIn={!!profile}
      isMyStory={isMyStory}
      showAuthModal={showAuthModal}
      showReplyModal={showReplyModal}
      toggleLikeStory={() => {}}
      deleteStory={deleteStory}
      {...props}
    />
  );
};

export default React.memo(Container);
