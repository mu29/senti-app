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
          style={styles.icon}
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
          style={styles.icon}
        />
      ),
    },
  },
  Add: {
    screen: () => null,
    navigationOptions: {
      tabBarIcon: (options: TabBarIconProps) => (
        <Image
          source={{ uri: `add${options.focused ? '_active' : ''}` }}
          style={styles.icon}
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
          style={styles.icon}
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
          style={styles.icon}
        />
      ),
    },
  },
}, {
  tabBarOptions: {
    activeTintColor: '#212121',
    inactiveTintColor: '#212121',
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
