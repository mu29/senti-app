import React, { useCallback } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import imageCacheHoc from 'react-native-image-cache-hoc';
import Modal from 'react-native-modal';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'components';
import {
  palette,
  typography,
} from 'constants/style';

const ITEM_SIZE = Dimensions.get('window').width / 5;

const CachableImage = imageCacheHoc(Image, {
  fileDirName: 'covers',
  cachePruneTriggerLimit: 1024 * 1024 * 50,
});

interface Props {
  isVisible: boolean;
  items: string[];
  updateCover: (cover: string) => void;
  hide: () => void;
}

const CoverModal: React.FunctionComponent<Props> = ({
  isVisible,
  items,
  updateCover,
  hide,
}) => {
  const renderItem = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => updateCover(item)}
      style={styles.item}
    >
      <CachableImage source={{ uri: item }} style={styles.image} permanent />
    </TouchableOpacity>
  ), []);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={hide}
      onBackButtonPress={hide}
      style={styles.modal}
      backdropOpacity={0}
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name="md-images" size={18} color={palette.white.default} />
          <Text style={[typography.heading4, styles.title]}>
            배경 이미지
          </Text>
        </View>
        <FlatGrid
          itemDimension={ITEM_SIZE}
          spacing={0}
          items={items}
          renderItem={renderItem}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    height: 256,
    backgroundColor: palette.transparent.black[40],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    backgroundColor: palette.transparent.black[40],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    marginLeft: 8,
    color: palette.white.default,
  },
  item: {
    height: Dimensions.get('window').width / 4,
  },
  image: {
    flex: 1,
  },
});

export default CoverModal;
