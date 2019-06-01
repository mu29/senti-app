import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import {
  inject,
  observer,
} from 'mobx-react/native';
import { RecordController } from 'components';
import {
  ChatStore,
  RecordStore,
  UiStore,
} from 'stores';
import { palette } from 'constants/style';

interface ReplyModalProps {
  chatStore?: ChatStore;
  recordStore?: RecordStore;
  uiStore?: UiStore;
}

@inject('chatStore', 'recordStore', 'uiStore')
@observer
class ReplyModal extends React.Component<ReplyModalProps> {
  public render() {
    const { isReplyModalVisible } = this.props.uiStore!;

    return (
      <Modal
        isVisible={isReplyModalVisible}
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
          <RecordController />
        </SafeAreaView>
      </Modal>
    );
  }

  private hide = () => {
    const {
      toggleReplyModal,
      isReplyModalVisible,
    } = this.props.uiStore!;

    if (!isReplyModalVisible) {
      return;
    }

    toggleReplyModal();
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    paddingTop: 56,
    paddingBottom: 24,
    backgroundColor: palette.black.default,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});

export default ReplyModal;
