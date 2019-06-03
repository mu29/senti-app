import React from 'react';
import { NavigationEvents } from 'react-navigation';
import {
  Header,
  ChattingList,
  withSafeArea,
} from 'components';
import { refreshChattingsAction } from 'stores/actions';

class ChattingScreen extends React.Component<{}> {
  public render() {
    return (
      <React.Fragment>
        <NavigationEvents onWillFocus={this.refresh} />
        <Header>
          대화
        </Header>
        <ChattingList />
      </React.Fragment>
    );
  }

  private refresh = () => {
    refreshChattingsAction(false);
  }
}

export default withSafeArea(ChattingScreen);
