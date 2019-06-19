import React from 'react';
import {
  Header,
  ChattingList,
  withSafeArea,
} from 'components';

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
