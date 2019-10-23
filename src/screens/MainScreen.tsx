import React, {
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
} from 'react-native';
import ViewPager, {
  ViewPagerOnPageSelectedEventData,
} from '@react-native-community/viewpager';
import { NewBottomTabBar } from 'containers';

import ChattingScreen from './ChattingScreen';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

const {
  width,
  height,
} = Dimensions.get('window');

const MainScreen = () => {
  const pagerRef = useRef<ViewPager>(null);

  const [index, setIndex] = useState(1);

  const onPageSelected = useCallback((event: NativeSyntheticEvent<ViewPagerOnPageSelectedEventData>) => {
    setIndex(event.nativeEvent.position);
  }, [setIndex]);

  const setPage = useCallback((index: number) => {
    pagerRef.current && pagerRef.current.setPage(index);
  }, []);

  return (
    <React.Fragment>
      <ViewPager
        ref={pagerRef}
        onPageSelected={onPageSelected}
        style={styles.container}
        initialPage={1}
        scrollEnabled={false}
      >
        <View style={styles.page} key="chatting" >
          <ChattingScreen />
        </View>
        <View style={styles.page} key="home" >
          <HomeScreen />
        </View>
        <View style={styles.page} key="profile" >
          <ProfileScreen />
        </View>
      </ViewPager>
      <NewBottomTabBar index={index} setPage={setPage} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    width,
    height,
  },
});

export default MainScreen;
