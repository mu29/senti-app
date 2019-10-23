import React, { useCallback } from 'react';
import { NavigationEvents } from 'react-navigation';
import {
  NewStoryList,
  ReplyModal,
} from 'containers';
import {
  AudioService,
  AnalyticsService,
} from 'services';

const HomeScreen: React.FunctionComponent<{}> = () => {
  const onDidFocus = useCallback(() => {
    AnalyticsService.setScreen('HomeScreen');
  }, []);

  return (
    <React.Fragment>
      <NewStoryList />
      <ReplyModal />
      <NavigationEvents onDidFocus={onDidFocus} onWillBlur={AudioService.stop} />
    </React.Fragment>
  );
};

export default HomeScreen;
