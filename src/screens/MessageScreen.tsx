import React from 'react';
import {
  NavigationEvents,
  withNavigation,
  NavigationScreenProps,
} from 'react-navigation';
import {
  inject,
  observer,
} from 'mobx-react/native';
import {
  Header,
  MessageList,
  MessageReply,
  LoadingView,
  withSafeArea,
} from 'components';
import { MessageState } from 'stores/states';
import { stopAudioAction } from 'stores/actions';
import { LoadingType } from 'constants/enums';

interface MessageScreenProps {
  messageState?: MessageState;
}

@inject('messageState')
@observer
class MessageScreen extends React.Component<MessageScreenProps & NavigationScreenProps> {
  public componentWillUnmount() {
    stopAudioAction();
  }

  public render() {
    const {
      navigation,
      messageState,
    } = this.props;

    const chattingId = navigation.getParam('chattingId', '');
    const partnerId = navigation.getParam('partnerId', '');
    const partnerName = navigation.getParam('partnerName', '');

    return (
      <React.Fragment>
        {messageState!.isLoading === LoadingType.CREATE && <LoadingView />}
        <NavigationEvents onWillBlur={stopAudioAction} />
        <Header canGoBack>
          {partnerName}
        </Header>
        <MessageList chattingId={chattingId} partnerId={partnerId} />
        <MessageReply />
      </React.Fragment>
    );
  }
}

export default withSafeArea(withNavigation(MessageScreen), {
  forceInset: {
    top: 'always',
    bottom: 'never',
  },
});
