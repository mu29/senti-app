import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import Modal from 'react-native-modal';
import { Text } from 'components';
import { LoginViewModel } from 'containers';
import { palette } from 'services/style';

interface LoginModalProps {
  viewModel?: LoginViewModel;
}

@inject('viewModel')
@observer
class LoginModal extends React.Component<LoginModalProps> {
  render() {
    const {
      toggleModal,
      isModalVisible,
    } = this.props.viewModel!;

    return (
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={styles.modal}
        backdropOpacity={0}
        useNativeDriver
        hideModalContentWhileAnimating
      >
        <View style={styles.container} />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    padding: 32,
    backgroundColor: palette.gray[10],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default LoginModal;
