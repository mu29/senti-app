import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import imageCacheHoc from 'react-native-image-cache-hoc';
import { CreateStoryViewModel } from 'containers';

const { width, height } = Dimensions.get('window');

const CachableImage = imageCacheHoc(Image, {
  fileDirName: 'covers',
  cachePruneTriggerLimit: 1024 * 1024 * 50,
});

interface CreateStoryCoverProps {
  viewModel?: CreateStoryViewModel;
}

const CreateStoryCover: React.FunctionComponent<CreateStoryCoverProps> = ({
  viewModel,
}) => (
  <React.Fragment>
    <CachableImage
      source={{ uri: viewModel!.cover }}
      style={styles.background}
      permanent
    />
    <View style={styles.filter} />
  </React.Fragment>
);

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
    backgroundColor: '#1A1A1A',
  },
  filter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default inject('viewModel')(observer(CreateStoryCover));
