import React, {
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import {
  FETCH_PROFILE,
  SHOW_MODAL,
} from 'graphqls';
import { WEBSITE_URL } from 'constants/config';

const DynamicLinkEvents: React.FunctionComponent<{}> = () => {
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

  const handlers = useMemo(() => [{
    regex: /\/referral\??(.*)/,
    handle: (params: Record<string, any>) => {
      if (profile) {
        return;
      }

      AsyncStorage.setItem('@Referrer', params.id)
        .then(() => showAuthModal())
        .catch(console.error);
    },
  }], [profile, showAuthModal]);

  const handleDynamicLink = useCallback((url: string | null) => {
    if (!url) {
      return;
    }

    const path = url.replace(WEBSITE_URL, '');

    handlers.forEach((handler) => {
      const matched = path.match(handler.regex);

      if (matched) {
        const params = matched[1].split('&').reduce((result, current) => ({
          ...result,
          [current.split('=')[0]]: current.split('=')[1],
        }), {});
        handler.handle(params);
      }
    });
  }, [handlers]);

  useEffect(() => {
    firebase.links().getInitialLink().then(handleDynamicLink).catch(console.error);
  }, [handleDynamicLink]);

  useEffect(() => {
    const unsubscriber = firebase.links().onLink(handleDynamicLink);
    return () => unsubscriber();
  }, [handleDynamicLink]);

  return null;
};

export default DynamicLinkEvents;
