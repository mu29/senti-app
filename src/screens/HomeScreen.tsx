import React from 'react';
import { NavigationEvents } from 'react-navigation';
import { StoryList, ReplyModal } from 'components';
import { pauseStoryAction } from 'stores/actions';

const HomeScreen: React.FunctionComponent<{}> = () => (
  <React.Fragment>
    <NavigationEvents onWillBlur={pauseStoryAction} />
    <StoryList />
    <ReplyModal />
  </React.Fragment>
);

export default HomeScreen;
