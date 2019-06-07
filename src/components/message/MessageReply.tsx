import React from 'react';
import { StyleSheet } from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import {
  RecordController,
  LoadingView,
} from 'components';
import { MessageState } from 'stores/states';
import { createMessageAction } from 'stores/actions';
import { palette } from 'constants/style';
import { LoadingType } from 'constants/enums';

interface MessageReplyProps {
  messageState?: MessageState;
}

@inject('messageState')
@observer
class MessageReply extends React.Component<MessageReplyProps> {
  public render() {
    const { messageState } = this.props;

    return (
      <React.Fragment>
        {messageState!.isLoading === LoadingType.CREATE && <LoadingView />}
        <RecordController create={createMessageAction} />
      </React.Fragment>
    );
  }
}

export default MessageReply;
