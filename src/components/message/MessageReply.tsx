import React from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
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

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'never',
  bottom: 'always',
};

interface MessageReplyProps {
  messageState?: MessageState;
}

@inject('messageState')
@observer
class MessageReply extends React.Component<MessageReplyProps> {
  public render() {
    const { messageState } = this.props;

    return (
      <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.container}>
        {messageState!.isLoading === LoadingType.CREATE && <LoadingView />}
        <RecordController create={createMessageAction} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: palette.black.default,
  },
});

export default MessageReply;
