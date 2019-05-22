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
import { UiStore } from 'stores';
import { palette } from 'services/style';

interface AuthModalProps {
  uiStore?: UiStore;
}

@inject('uiStore')
@observer
class AuthModal extends React.Component<AuthModalProps> {
  render() {
    const {
      toggleAuthModal,
      isAuthModalVisible,
    } = this.props.uiStore!;

    return (
      <Modal
        isVisible={isAuthModalVisible}
        onBackdropPress={toggleAuthModal}
        onBackButtonPress={toggleAuthModal}
        style={styles.modal}
        backdropOpacity={0}
        useNativeDriver
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
    padding: 64,
    backgroundColor: palette.white.default,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default AuthModal;
