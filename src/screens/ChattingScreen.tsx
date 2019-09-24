import React, { useCallback } from 'react';
import { NavigationEvents } from 'react-navigation';
import {
  Header,
  withSafeArea,
} from 'components';
import { ChattingList } from 'containers';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

const ChattingScreen: React.FunctionComponent<{}> = () => {
  const onDidFocus = useCallback(() => {
    AnalyticsService.setScreen(ChattingScreen.name);
  }, []);

  return (
    <React.Fragment>
      <Header>
        {LocalizedStrings.SCREEN_CHATTING}
      </Header>
      <ChattingList />
      <NavigationEvents onDidFocus={onDidFocus} />
    </React.Fragment>
  );
};

export default withSafeArea(ChattingScreen);
