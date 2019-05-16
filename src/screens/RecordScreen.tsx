import React from 'react';
import {
  View,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Recorder } from 'components';

const { width, height } = Dimensions.get('window');

const RecordScreen = () => (
  <SafeAreaView style={styles.safeArea}>
    <StatusBar hidden />
    <Image
      source={{ uri: 'https://cdn.pixabay.com/photo/2019/05/07/03/33/night-4184916_1280.jpg' }}
      style={styles.background}
    />
    <View style={styles.filter} />
    <View style={styles.container}>
      <Recorder />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  container: {
    flex: 1,
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
