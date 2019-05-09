import React from 'react'
import {
  createAppContainer,
  createBottomTabNavigator,
} from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import FeedScreen from './screens/FeedScreen'
import RoomScreen from './screens/RoomScreen'

const MainNavigator = createBottomTabNavigator({
  Feed: {
    screen: FeedScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }: { tintColor: string }) => (
        <Icon name="md-pulse" size={25} color={tintColor} />
      ),
    },
  },
  Add: {
    screen: () => null,
    navigationOptions: {
      tabBarIcon: () => (
        <Icon name="ios-add-circle" size={36} color="#6830CF" />
      ),
    },
  },
  Room: {
    screen: RoomScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }: { tintColor: string }) => (
        <Icon name="ios-text" size={25} color={tintColor} />
      ),
    },
  },
}, {
  tabBarOptions: {
    activeTintColor: '#424242',
    inactiveTintColor: '#9E9E9E',
    showLabel: false,
  }
})

export default createAppContainer(MainNavigator)
