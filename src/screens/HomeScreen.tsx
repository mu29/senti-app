import React from 'react';
import { NavigationEvents } from 'react-navigation';
import { ReplyModal } from 'components';
import { StoryList } from 'containers';
import { SoundService } from 'services';

const HomeScreen: React.FunctionComponent<{}> = () => (
  <React.Fragment>
    <NavigationEvents onWillBlur={SoundService.pause} />
    <StoryList />
    <ReplyModal />
  </React.Fragment>
);

export default HomeScreen;
