import React from 'react';
import {
  withNavigation,
  NavigationScreenProps,
} from 'react-navigation';
import {
  Header,
  MessageList,
  withSafeArea,
} from 'components';

const MessageScreen: React.FunctionComponent<NavigationScreenProps> = ({
  navigation,
}) => {
  const chattingId = navigation.getParam('chattingId', '');

  return (
    <React.Fragment>
      <Header canGoBack>
        정인중
      </Header>
      <MessageList chattingId={chattingId} />
    </React.Fragment>
  );
};

export default withSafeArea(withNavigation(MessageScreen));
