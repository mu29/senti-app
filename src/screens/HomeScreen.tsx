import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import {
  ParallaxSwiper,
  ParallaxSwiperPage
} from 'react-native-parallax-swiper';

const { width, height } = Dimensions.get('window');

const swiperAnimation = new Animated.Value(0);

const HomeScreen = () => (
  <React.Fragment>
    <ParallaxSwiper
      speed={0.5}
      vertical
      backgroundColor="#1A1A1A"
      animatedValue={swiperAnimation}
    >
      <ParallaxSwiperPage
        BackgroundComponent={(
          <Image
            source={{ uri: 'https://cdn.pixabay.com/photo/2019/05/07/03/33/night-4184916_1280.jpg' }}
            style={styles.background}
          />
        )}
        ForegroundComponent={(
          <View style={styles.filter} />
        )}
      />
      <ParallaxSwiperPage
        BackgroundComponent={(
          <Image
            source={{ uri: 'https://cdn.pixabay.com/photo/2019/05/08/10/09/city-4188256_1280.jpg' }}
            style={styles.background}
          />
        )}
        ForegroundComponent={(
          <View style={styles.filter} />
        )}
      />
    </ParallaxSwiper>
  </React.Fragment>
);

const styles = StyleSheet.create({
  background: {
    width,
    height,
    backgroundColor: '#1A1A1A',
  },
  filter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
});

export default HomeScreen;
