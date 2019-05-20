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
import Modal from 'react-native-modal';
import { FlatGrid } from 'react-native-super-grid';
import { Text } from 'bootstrap';
import { RecordViewModel } from 'containers';
import { palette } from 'services/style';

const ITEM_SIZE = Dimensions.get('window').width / 5;

interface ImagePickerModalProps {
  viewModel?: RecordViewModel;
}

@inject('viewModel')
@observer
class ImagePickerModal extends React.Component<ImagePickerModalProps> {
  public render() {
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
          <View style={styles.header}>
            <Text style={styles.title}>
              배경 이미지
            </Text>
          </View>
          <FlatGrid
            itemDimension={ITEM_SIZE}
            spacing={0}
            items={[
              'https://cdn.pixabay.com/photo/2016/09/20/18/49/brushes-1683134__480.jpg',
              'https://cdn.pixabay.com/photo/2019/02/12/11/25/cruise-3991937__480.jpg',
              'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__480.jpg',
              'https://cdn.pixabay.com/photo/2019/03/11/09/53/car-4048220__480.jpg',
              'https://cdn.pixabay.com/photo/2015/06/24/16/54/lighthouse-820431__480.jpg',
              'https://cdn.pixabay.com/photo/2019/05/15/21/14/sunbeam-4205970__480.jpg',
              'https://cdn.pixabay.com/photo/2019/05/18/04/51/love-4211222__480.jpg',
              'https://cdn.pixabay.com/photo/2019/05/17/15/28/castle-4209924__480.jpg',
              'https://cdn.pixabay.com/photo/2019/05/10/08/33/stone-house-4193002__480.jpg',
              'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__480.jpg',
              'https://cdn.pixabay.com/photo/2019/05/15/03/59/moon-4204030__480.jpg',
              'https://cdn.pixabay.com/photo/2019/05/10/08/33/stone-house-4193002__480.jpg',
              'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__480.jpg',
              'https://cdn.pixabay.com/photo/2019/03/11/09/53/car-4048220__480.jpg',
              'https://cdn.pixabay.com/photo/2015/06/24/16/54/lighthouse-820431__480.jpg',
            ]}
            renderItem={this.renderItem}
          />
        </View>
      </Modal>
    );
  }

  private renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity activeOpacity={0.6} style={styles.item}>
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  )
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
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    color: palette.white.default,
    fontSize: 14,
    fontWeight: '600',
  },
  item: {
    height: 96,
  },
  image: {
    flex: 1,
    // borderRadius: 8,
  },
});

export default ImagePickerModal;
