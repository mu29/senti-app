import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import imageCacheHoc from 'react-native-image-cache-hoc';
import Modal from 'react-native-modal';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'components';
import { RecordViewModel } from 'containers';
import { RecordStore } from 'stores';
import { palette } from 'services/style';

const ITEM_SIZE = Dimensions.get('window').width / 5;

const CachableImage = imageCacheHoc(Image, {
  fileDirName: 'covers',
  cachePruneTriggerLimit: 1024 * 1024 * 50,
});

interface ImagePickerModalProps {
  recordStore?: RecordStore;
  viewModel?: RecordViewModel;
}

@inject('recordStore', 'viewModel')
@observer
class ImagePickerModal extends React.Component<ImagePickerModalProps> {
  private pressHandlers: { [key: string]: () => void } = {};

  public render() {
    const { isAlbumVisible } = this.props.viewModel!;
    const { covers } = this.props.recordStore!;

    return (
      <Modal
        isVisible={isAlbumVisible}
        onBackdropPress={this.hide}
        onBackButtonPress={this.hide}
        style={styles.modal}
        backdropOpacity={0}
        animationInTiming={400}
        animationOutTiming={1000}
        useNativeDriver
        hideModalContentWhileAnimating
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Icon name="md-images" size={18} color={palette.white.default} />
            <Text style={styles.title}>
              배경 이미지
            </Text>
          </View>
          <FlatGrid
            itemDimension={ITEM_SIZE}
            spacing={0}
            items={covers}
            renderItem={this.renderItem}
          />
        </View>
      </Modal>
    );
  }

  private renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={this.getPressHandler(item)}
      style={styles.item}
    >
      <CachableImage source={{ uri: item }} style={styles.image} permanent />
    </TouchableOpacity>
  )

  private getPressHandler = (url: string) => {
    const {
      toggleAlbum,
      updateCover,
    } = this.props.viewModel!;

    if (!Object.prototype.hasOwnProperty.call(this.pressHandlers, url)) {
      this.pressHandlers[url] = () => {
        updateCover(url);
        toggleAlbum();
      };
    }

    return this.pressHandlers[url];
  }

  private hide = () => {
    const {
      toggleAlbum,
      isAlbumVisible,
    } = this.props.viewModel!!;

    if (!isAlbumVisible) {
      return;
    }

    toggleAlbum();
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    height: 256,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    marginLeft: 8,
    color: palette.white.default,
    fontSize: 14,
    fontWeight: '600',
  },
  item: {
    height: 96,
  },
  image: {
    flex: 1,
  },
});

export default ImagePickerModal;
