import React, { useEffect } from 'react';
import firebase from 'react-native-firebase';
import { WEBSITE_URL } from 'constants/config';

const DynamicLinkEvents: React.FunctionComponent<{}> = () => {
  useEffect(() => {
    firebase.links()
      .getInitialLink()
      .then((url) => {
        if (!url) {
          return
        }

        const path = url.replace(WEBSITE_URL, '');

        switch (path) {
          case '/earlybird':
            break;
          case '/referral':
            break;
        }
      });
  }, []);

  return null;
};

export default DynamicLinkEvents;
