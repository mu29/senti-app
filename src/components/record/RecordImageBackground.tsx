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
import { RecordViewModel } from 'containers';

const { width, height } = Dimensions.get('window');

interface RecordImageBackgroundProps {
  viewModel?: RecordViewModel;
}

const RecordImageBackground: React.FunctionComponent<RecordImageBackgroundProps> = ({
  viewModel,
}) => (
  <React.Fragment>
    <Image
      source={{ uri: viewModel!.backgroundResource }}
      style={styles.background}
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

export default inject('viewModel')(observer(RecordImageBackground));
