import React from 'react';
import {
  NavigationEvents,
  NavigationScreenProps,
} from 'react-navigation';
import {
  Header,
  withSafeArea,
} from 'components';
import {
  MessageList,
  MessageReply,
} from 'containers';
import { AudioService } from 'services';

const MessageScreen: React.FunctionComponent<NavigationScreenProps> = ({
  navigation,
}) => {
  const chattingId = navigation.getParam('chattingId', '');
  const partnerName = navigation.getParam('partnerName', '');

  return (
    <React.Fragment>
      <NavigationEvents onWillBlur={AudioService.release} />
      <Header canGoBack>
        {partnerName}
      </Header>
      <MessageList chattingId={chattingId} />
      <MessageReply chattingId={chattingId} />
    </React.Fragment>
  );
};

export default withSafeArea(MessageScreen, {
  forceInset: {
    top: 'always',
    bottom: 'never',
  },
});
