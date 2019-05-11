import React from 'react';
import {
  Image,
  StyleSheet,
} from 'react-native';
import {
  createAppContainer,
  createBottomTabNavigator,
  TabBarIconProps,
} from 'react-navigation';
import { BottomTabBar } from 'components';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import RoomScreen from './screens/RoomScreen';
import ProfileScreen from './screens/ProfileScreen';

const MainNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarIcon: (options: TabBarIconProps) => (
        <Image
          source={{ uri: `home${options.focused ? '_active' : ''}` }}
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
          source={{ uri: `search${options.focused ? '_active' : ''}` }}
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
          source={{ uri: 'add_active' }}
          style={[styles.icon, { tintColor: '#FFFFFF' }]}
        />
      ),
    },
  },
  Room: {
    screen: RoomScreen,
    navigationOptions: {
      tabBarIcon: (options: TabBarIconProps) => (
        <Image
          source={{ uri: `chat${options.focused ? '_active' : ''}` }}
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
          source={{ uri: `profile${options.focused ? '_active' : ''}` }}
          style={[styles.icon, { tintColor: options.tintColor! }]}
        />
      ),
    },
  },
}, {
  tabBarComponent: BottomTabBar,
  tabBarOptions: {
    activeTintColor: '#FFFFFF',
    inactiveTintColor: '#A2A2A2',
    showLabel: false,
  },
});

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default createAppContainer(MainNavigator);
