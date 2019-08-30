import React from 'react';
import {
  Header,
  withSafeArea,
} from 'components';
import { ChattingList } from 'containers';

class ChattingScreen extends React.Component<{}> {
  public render() {
    return (
      <React.Fragment>
        <Header>
          대화
        </Header>
        <ChattingList />
      </React.Fragment>
    );
  }
}

export default withSafeArea(ChattingScreen);
