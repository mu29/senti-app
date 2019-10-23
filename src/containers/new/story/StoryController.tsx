import React from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { NewStoryController } from 'components';
import {
  SHOW_MODAL,
  FETCH_PROFILE,
} from 'graphqls';

interface Props {
  item: Story;
  showNextStory: () => void;
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

  return (
    <NewStoryController
      item={item}
      isLoggedIn={!!profile}
      showAuthModal={showAuthModal}
      showReplyModal={showReplyModal}
      {...props}
    />
  );
};

export default React.memo(Container);
