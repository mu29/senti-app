import React, { useCallback } from 'react';
import {
  Share,
  Platform,
  Alert,
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { ReferralCoinItem } from 'components';
import { FETCH_PROFILE } from 'graphqls';
import { DynamicLinkService } from 'services';
import { LocalizedStrings } from 'constants/translations';

const Container: React.FunctionComponent<{}> = () => {
  const {
    data: {
      profile,
    } = {
      profile: undefined,
    },
  } = useQuery<{ profile: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const onPress = useCallback(() => {
    if (!profile) {
      return;
    }

    DynamicLinkService.createReferralLink(profile.id)
      .then(url => {
        if (!url) {
          return;
        }

        Share.share({
          ...(Platform.OS === 'ios' ? { url } : { message: url }),
        }, {
          dialogTitle: LocalizedStrings.COIN_REFERRAL,
        });
      })
      .catch(e => Alert.alert(LocalizedStrings.COMMON_ERROR, e.message));
  }, [profile]);

  return (
    <ReferralCoinItem onPress={onPress} />
  );
};

export default React.memo(Container);
