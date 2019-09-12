import React, { useCallback } from 'react';
import { NavigationEvents } from 'react-navigation';
import {
  Header,
  withSafeArea,
} from 'components';
import { ChattingList } from 'containers';
import { AnalyticsService } from 'services';

const ChattingScreen: React.FunctionComponent<{}> = () => {
  const onDidFocus = useCallback(() => {
    AnalyticsService.setScreen(ChattingScreen.name);
  }, []);

  return (
    <React.Fragment>
      <Header>
        대화
      </Header>
      <ChattingList />
      <NavigationEvents onDidFocus={onDidFocus} />
    </React.Fragment>
  );
};

export default withSafeArea(ChattingScreen);
