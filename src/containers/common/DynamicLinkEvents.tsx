import React, {
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { useMutation } from '@apollo/react-hooks';
import { SHOW_MODAL } from 'graphqls';
import { WEBSITE_URL } from 'constants/config';
import { Alert } from 'react-native';

const DynamicLinkEvents: React.FunctionComponent<{}> = () => {
  const [showAuthModal] = useMutation(SHOW_MODAL, {
    variables: { id: 'Auth' },
  });

  const handlers = useMemo(() => [{
    regex: /\/referral\??(.*)/,
    handle: (params: Record<string, any>) => {
      AsyncStorage.setItem('@Referral', params.id)
        .then(() => {
          Alert.alert('오우', params.id)
          showAuthModal()
        })
        .catch(console.error);
    }
  }], [showAuthModal]);

  const handleDynamicLink = useCallback((url: string | null) => {
    if (!url) {
      return;
    }

    const path = url.replace(WEBSITE_URL, '');

    handlers.forEach((handler) => {
      const matched = path.match(handler.regex);

      if (matched) {
        const params = JSON.parse(matched[1] || '{}');
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
