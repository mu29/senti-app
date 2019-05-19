import React from 'react';
import {
  View,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import { RecordContainer } from 'containers';

const { width, height } = Dimensions.get('window');

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'always',
  bottom: 'always',
};

const RecordScreen = () => (
  <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.container}>
    <StatusBar hidden />
    <Image
      source={{ uri: 'https://cdn.pixabay.com/photo/2019/05/07/03/33/night-4184916_1280.jpg' }}
      style={styles.background}
    />
    <View style={styles.filter} />
    <RecordContainer />
  </SafeAreaView>
);

RecordScreen.navigationOptions = {
  gesturesEnabled: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
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

export default RecordScreen;
