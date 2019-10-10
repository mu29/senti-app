import React, {
  useCallback,
  useMemo,
} from 'react';
import {
  withNavigation,
  NavigationInjectedProps,
} from 'react-navigation';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { TagItem } from 'components';
import {
  SHOW_MODAL,
  FETCH_PROFILE,
  SUBSCRIBE_TAG,
  UNSUBSCRIBE_TAG,
} from 'graphqls';

interface Props extends NavigationInjectedProps {
  item: Tag;
}

const TagItemContainer: React.FunctionComponent<Props> = ({
  item,
  navigation,
}) => {
  const { data: profile } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const [showAuthModal] = useMutation(SHOW_MODAL, {
    variables: { id: 'Auth' },
  });

  const [subscribeTag, { loading: subscribing }] = useMutation(SUBSCRIBE_TAG, {
    variables: {
      id: item.id,
    },
    update: (cache) => {
      try {
        const savedProfile = cache.readQuery<{ me: Profile }>({ query: FETCH_PROFILE });

        if (!savedProfile) {
          return;
        }

        cache.writeQuery({
          query: FETCH_PROFILE,
          data: {
            me: {
              ...savedProfile.me,
              tags: savedProfile.me.tags.concat(item.id),
            },
          },
        });
      } catch {}
    },
  });

  const [unsubscribeTag, { loading: unsubscribing }] = useMutation(UNSUBSCRIBE_TAG, {
    variables: {
      id: item.id,
    },
    update: (cache) => {
      try {
        const savedProfile = cache.readQuery<{ me: Profile }>({ query: FETCH_PROFILE });

        if (!savedProfile) {
          return;
        }

        cache.writeQuery({
          query: FETCH_PROFILE,
          data: {
            me: {
              ...savedProfile.me,
              tags: savedProfile.me.tags.filter(t => t !== item.id),
            },
          },
        });
      } catch {}
    },
  });

  const isSubscribed = useMemo(() => {
    return profile && profile.me ? !!profile.me.tags.find(t => t === item.id) : false;
  }, [item.id, profile]);

  const toggle = useCallback(() => {
    return isSubscribed ? unsubscribeTag() : subscribeTag();
  }, [isSubscribed, subscribeTag, unsubscribeTag]);

  const openTagStoryScreen = useCallback(() => {
    navigation.navigate('TagStory', { tagId: item.id });
  }, [item.id, navigation]);

  const isLoggedIn = !!(profile && profile.me);

  return (
    <TagItem
      item={item}
      isLoggedIn={isLoggedIn}
      isSubscribed={isSubscribed}
      isLoading={subscribing || unsubscribing}
      toggle={toggle}
      showAuthModal={showAuthModal}
      openTagStoryScreen={openTagStoryScreen}
    />
  );
};

export default withNavigation(React.memo(TagItemContainer));
