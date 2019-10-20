import React, { useCallback } from 'react';
import { NavigationEvents } from 'react-navigation';
import {
  StoryList,
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
      <StoryList />
      <ReplyModal />
      <NavigationEvents onDidFocus={onDidFocus} />
      <NavigationEvents onWillBlur={AudioService.pause} />
    </React.Fragment>
  );
};

export default HomeScreen;
