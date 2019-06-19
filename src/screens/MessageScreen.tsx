import React from 'react';
import {
  NavigationEvents,
  withNavigation,
  NavigationScreenProps,
} from 'react-navigation';
import {
  Header,
  MessageList,
  MessageReply,
  withSafeArea,
} from 'components';
import { stopAudioAction } from 'stores/actions';

const MessageScreen: React.FunctionComponent<NavigationScreenProps> = ({
  navigation,
}) => {
  const chattingId = navigation.getParam('chattingId', '');
  const partnerId = navigation.getParam('partnerId', '');
  const partnerName = navigation.getParam('partnerName', '');

  return (
    <React.Fragment>
      <NavigationEvents onWillBlur={stopAudioAction} />
      <Header canGoBack>
        {partnerName}
      </Header>
      <MessageList chattingId={chattingId} partnerId={partnerId} />
      <MessageReply />
    </React.Fragment>
  );
};

export default withSafeArea(withNavigation(MessageScreen), {
  forceInset: {
    top: 'always',
    bottom: 'never',
  },
});
