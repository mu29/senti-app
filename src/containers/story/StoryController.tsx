import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import firebase from 'react-native-firebase';
import ActionSheet from 'rn-actionsheet-module';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { StoryController } from 'components';
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

const StoryControllerContainer: React.FunctionComponent<Props> = ({
  item,
  ...props
}) => {
  const { data: profile } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    skip: !firebase.auth().currentUser,
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

  const [deleteStory, { loading }] = useMutation(DELETE_STORY, {
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

  const showDeleteAlert = useCallback(() => {
    ActionSheet({
      title: '정말 삭제하시겠습니까?',
      optionsIOS: ['삭제', '취소'],
      optionsAndroid: ['삭제'],
      cancelButtonIndex: 1,
      onCancelAndroidIndex: 1,
    }, (index: number) => {
      if (index === 0) {
        deleteStory().catch(e => Alert.alert('오류', `이야기 삭제에 실패했습니다.\n${e.message}`));
      }
    });
  }, [deleteStory]);

  const isLoggedIn = !!(profile && profile.me);
  const isMyStory = isLoggedIn && profile!.me.id === item.user.id;

  return (
    <StoryController
      item={item}
      isLoggedIn={isLoggedIn}
      isMyStory={isMyStory}
      isLoading={loading}
      showAuthModal={showAuthModal}
      showReplyModal={showReplyModal}
      showDeleteAlert={showDeleteAlert}
      {...props}
    />
  );
};

export default React.memo(StoryControllerContainer);
