import React from 'react';
import {
  Header,
  MessageList,
  withSafeArea,
} from 'components';

const MessageScreen: React.FunctionComponent<{}> = () => (
  <React.Fragment>
    <Header>
      정인중
    </Header>
    <MessageList />
  </React.Fragment>
);

export default withSafeArea(MessageScreen);
