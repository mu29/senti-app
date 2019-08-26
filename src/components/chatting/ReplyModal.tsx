import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import {
  inject,
  observer,
} from 'mobx-react/native';
import {
  RecordController,
  LoadingLayer,
} from 'components';
import { ChattingState } from 'stores/states';
import {
  createChattingAction,
  hideReplyModalAction,
} from 'stores/actions';
import { palette } from 'constants/style';
import { LoadingType } from 'constants/enums';

interface ReplyModalProps {
  chattingState?: ChattingState;
}

@inject('chattingState')
@observer
class ReplyModal extends React.Component<ReplyModalProps> {
  public render() {
    const { chattingState } = this.props;

    return (
      <React.Fragment>
        {chattingState!.isLoading === LoadingType.CREATE && <LoadingLayer />}
        <Modal
          isVisible={chattingState!.isModalVisible}
          onBackdropPress={this.hide}
          onBackButtonPress={this.hide}
          style={styles.modal}
          backdropOpacity={0}
          animationInTiming={400}
          animationOutTiming={600}
          hideModalContentWhileAnimating={true}
          useNativeDriver
        >
          <SafeAreaView style={styles.container} pointerEvents="auto">
            <RecordController create={createChattingAction} />
          </SafeAreaView>
        </Modal>
      </React.Fragment>
    );
  }

  private hide = () => {
    if (this.props.chattingState!.isModalVisible) {
      hideReplyModalAction();
    }
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: palette.black.default,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});

export default ReplyModal;
