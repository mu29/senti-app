import React from 'react';
import { NavigationEvents } from 'react-navigation';
import { ReplyModal } from 'components';
import { StoryList } from 'containers';
import { pauseAudioAction } from 'stores/actions';

const HomeScreen: React.FunctionComponent<{}> = () => (
  <React.Fragment>
    <NavigationEvents onWillBlur={pauseAudioAction} />
    <StoryList />
    <ReplyModal />
  </React.Fragment>
);

export default HomeScreen;
