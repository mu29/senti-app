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
import { RecordViewModel } from 'containers';

interface ImagePickerModalProps {
  viewModel?: RecordViewModel;
}

@inject('viewModel')
@observer
class ImagePickerModal extends React.Component<ImagePickerModalProps> {
  render() {
    const {
      toggleAlbum,
      isAlbumVisible,
    } = this.props.viewModel!;

    return (
      <Modal
        isVisible={isAlbumVisible}
        onBackdropPress={toggleAlbum}
        onBackButtonPress={toggleAlbum}
        style={styles.modal}
        backdropOpacity={0}
        useNativeDriver
        hideModalContentWhileAnimating
      >
        <View style={styles.container}>
          <View style={{ padding: 64 }} />
        </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});

export default ImagePickerModal;
