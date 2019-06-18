import React from 'react';
import { NavigationEvents } from 'react-navigation';
import { StoryList, ReplyModal } from 'components';
import { pauseAudioAction } from 'stores/actions';

const HomeScreen: React.FunctionComponent<{}> = () => (
  <React.Fragment>
    <NavigationEvents onWillBlur={pauseAudioAction} />
    <StoryList />
    <ReplyModal />
  </React.Fragment>
);

export default HomeScreen;
