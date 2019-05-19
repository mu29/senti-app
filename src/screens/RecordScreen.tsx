import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { withSafeArea } from 'components';
import { RecordContainer } from 'containers';

const { width, height } = Dimensions.get('window');

const RecordScreen = () => (
  <React.Fragment>
    <Image
      source={{ uri: 'https://cdn.pixabay.com/photo/2019/05/07/03/33/night-4184916_1280.jpg' }}
      style={styles.background}
    />
    <View style={styles.filter} />
    <RecordContainer />
  </React.Fragment>
);

RecordScreen.navigationOptions = {
  gesturesEnabled: false,
};

const styles = StyleSheet.create({
  filter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
    backgroundColor: '#1A1A1A',
  },
});

export default withSafeArea(RecordScreen);
