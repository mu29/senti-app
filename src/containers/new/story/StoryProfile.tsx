import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { NewStoryProfile } from 'components';
import {
  REPORT_USER,
  FETCH_MAIN_STORY_FEED,
} from 'graphqls';

type MainStoryFeedResult = {
  mainStoryFeed: {
    stories: Story[];
    cursor: string;
  };
};

interface Props {
  item: Story;
}

const Container: React.FunctionComponent<Props> = ({
  item,
  ...props
}) => {
  const [reportUser] = useMutation(REPORT_USER, {
    variables: {
      id: item.user.id,
      storyId: item.id,
      audioUrl: item.audio.url,
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
              stories: data.mainStoryFeed.stories.filter(story => story.user.id !== item.user.id),
            },
          },
        });
      } catch {}
    },
  });

  return (
    <NewStoryProfile item={item} reportUser={reportUser} {...props} />
  );
};

export default React.memo(Container);
