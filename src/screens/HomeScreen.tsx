import React from 'react';
import {
  ImageBackground,
  StyleSheet,
} from 'react-native';

// 'https://cdn.pixabay.com/photo/2019/05/07/03/33/night-4184916_1280.jpg'

const HomeScreen = () => (
  <React.Fragment>
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2019/05/07/03/33/night-4184916_1280.jpg' }}
      style={styles.container}
    />
  </React.Fragment>
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1A1A1A',
  },
});

export default HomeScreen;
