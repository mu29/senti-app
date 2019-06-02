import React from 'react';
import {
  Header,
  ChattingList,
  withSafeArea,
} from 'components';

const ChattingScreen = () => (
  <React.Fragment>
    <Header>
      대화
    </Header>
    <ChattingList />
  </React.Fragment>
);

export default withSafeArea(ChattingScreen);
