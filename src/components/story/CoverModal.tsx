import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Text,
  CachableImage,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

const ITEM_SIZE = Dimensions.get('window').width / 5;

interface Props {
  isVisible: boolean;
  items: Array<{ thumb: string; original: string; }>;
  updateCover: (cover: string) => void;
  hide: () => void;
}

const CoverModal: React.FunctionComponent<Props> = ({
  isVisible,
  items,
  updateCover,
  hide,
}) => {
  const onPressItem = useCallback((item) => {
    updateCover(item);
    AnalyticsService.logEvent('update_story_cover');
  }, [updateCover]);

  const renderItem = useCallback(({ item }: { item: { thumb: string; original: string; } }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onPressItem(item.original)}
      style={styles.item}
    >
      <CachableImage prefix="covers" source={item.thumb} style={styles.image} />
    </TouchableOpacity>
  ), [onPressItem]);

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
            {LocalizedStrings.COVER_MODAL}
          </Text>
        </View>
        <FlatGrid
          itemDimension={ITEM_SIZE}
          spacing={0}
          items={items}
          renderItem={renderItem}
          initialNumToRender={items.length}
          removeClippedSubviews
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
    backgroundColor: palette.black.default,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
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

export default React.memo(CoverModal);
