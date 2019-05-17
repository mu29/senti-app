import React from 'react';
import {
  Image,
  StyleSheet,
} from 'react-native';
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
  TabBarIconProps,
} from 'react-navigation';
import { BottomTabBar } from 'components';
import { palette } from 'services/style';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import ChattingScreen from './screens/ChattingScreen';
import RecordScreen from './screens/RecordScreen';
import ProfileScreen from './screens/ProfileScreen';

const MainTabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarIcon: (options: TabBarIconProps) => (
        <Image
          source={{ uri: `ic_home${options.focused ? '_active' : ''}` }}
          style={[styles.icon, { tintColor: options.tintColor! }]}
        />
      ),
    },
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      tabBarIcon: (options: TabBarIconProps) => (
        <Image
          source={{ uri: `ic_search${options.focused ? '_active' : ''}` }}
          style={[styles.icon, { tintColor: options.tintColor! }]}
        />
      ),
    },
  },
  Add: {
    screen: () => null,
    navigationOptions: {
      tabBarIcon: () => (
        <Image
          source={{ uri: 'ic_add_active' }}
          style={[styles.icon, { tintColor: palette.gray[10] }]}
        />
      ),
      tabBarOnPress: ({ navigation }: { navigation: any }) => navigation.navigate('Record'),
    },
  },
  Chatting: {
    screen: ChattingScreen,
    navigationOptions: {
      tabBarIcon: (options: TabBarIconProps) => (
        <Image
          source={{ uri: `ic_chat${options.focused ? '_active' : ''}` }}
          style={[styles.icon, { tintColor: options.tintColor! }]}
        />
      ),
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarIcon: (options: TabBarIconProps) => (
        <Image
          source={{ uri: `ic_profile${options.focused ? '_active' : ''}` }}
          style={[styles.icon, { tintColor: options.tintColor! }]}
        />
      ),
    },
  },
}, {
  tabBarComponent: BottomTabBar,
  tabBarOptions: {
    activeTintColor: palette.gray[10],
    inactiveTintColor: palette.gray[40],
    showLabel: false,
  },
  initialRouteName: 'Home',
});

const ModalNavigator = createStackNavigator({
  MainTab: MainTabNavigator,
  Record: {
    screen: RecordScreen,
  },
}, {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'MainTab',
});

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default createAppContainer(ModalNavigator);
