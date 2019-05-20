import React from 'react';
import { withSafeArea } from 'components';
import { RecordContainer } from 'containers';

const RecordScreen = () => (
  <RecordContainer />
);

RecordScreen.navigationOptions = {
  gesturesEnabled: false,
};

export default withSafeArea(RecordScreen);
