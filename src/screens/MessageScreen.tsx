import React, { useCallback } from 'react';
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
import {
  AudioService,
  AnalyticsService,
} from 'services';

const MessageScreen: React.FunctionComponent<NavigationScreenProps> = ({
  navigation,
}) => {
  const onDidFocus = useCallback(() => {
    AnalyticsService.setScreen(MessageScreen.name);
  }, []);

  const chattingId = navigation.getParam('chattingId', '');
  const partnerName = navigation.getParam('partnerName', '');

  return (
    <React.Fragment>
      <Header canGoBack>
        {partnerName}
      </Header>
      <MessageList chattingId={chattingId} />
      <MessageReply chattingId={chattingId} />
      <NavigationEvents onDidFocus={onDidFocus} />
      <NavigationEvents onWillBlur={AudioService.release} />
    </React.Fragment>
  );
};

export default withSafeArea(MessageScreen, {
  forceInset: {
    top: 'always',
    bottom: 'never',
  },
});
