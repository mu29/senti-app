import React, { useCallback } from 'react';
import { View } from 'react-native';
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

  // return <View style={{ flex: 1, backgroundColor: '#000' }} />;

  return (
    <React.Fragment>
      <NewStoryList />
      <ReplyModal />
      <NavigationEvents onDidFocus={onDidFocus} onWillBlur={AudioService.stop} />
    </React.Fragment>
  );
};

export default HomeScreen;
