import React from 'react';
import { withSafeArea } from 'components';
import { CreateStoryContainer } from 'containers';

const CreateStoryScreen = () => (
  <CreateStoryContainer />
);

export default withSafeArea(CreateStoryScreen);
