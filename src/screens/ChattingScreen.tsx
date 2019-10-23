import React, { useCallback } from 'react';
import { NavigationEvents } from 'react-navigation';
import {
  useQuery,
  useApolloClient,
} from '@apollo/react-hooks';
import {
  Header,
  withSafeArea,
} from 'components';
import {
  FreeCoinTimer,
  ChattingList,
  CoinModal,
} from 'containers';
import {
  AnalyticsService,
  NotificationService,
} from 'services';
import {
  FETCH_PROFILE,
  FETCH_CHATTING_FEED,
} from 'graphqls';
import { LocalizedStrings } from 'constants/translations';

const ChattingScreen: React.FunctionComponent<{}> = () => {
  const client = useApolloClient();

  const {
    data: {
      profile,
    } = {
      profile: undefined,
    },
  } = useQuery<{ profile: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const onDidFocus = useCallback(() => {
    client.query({
      query: FETCH_CHATTING_FEED,
      fetchPolicy: 'network-only',
    });
    NotificationService.clearBadge();
    AnalyticsService.setScreen('ChattingScreen');
  }, [client]);

  if (!profile) {
    return null;
  }

  return (
    <React.Fragment>
      <Header>
        {LocalizedStrings.SCREEN_CHATTING}
      </Header>
      <FreeCoinTimer />
      <ChattingList />
      <CoinModal />
      <NavigationEvents onDidFocus={onDidFocus} />
    </React.Fragment>
  );
};

export default withSafeArea(ChattingScreen);
