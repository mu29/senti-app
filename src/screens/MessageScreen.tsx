import React from 'react';
import {
  NavigationEvents,
  NavigationScreenProps,
} from 'react-navigation';
import {
  Header,
  MessageReply,
  withSafeArea,
} from 'components';
import { MessageList } from 'containers';
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
      <MessageReply />
    </React.Fragment>
  );
};

export default withSafeArea(MessageScreen, {
  forceInset: {
    top: 'always',
    bottom: 'never',
  },
});
