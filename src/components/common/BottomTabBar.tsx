import React from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import {
  BottomTabBarProps as NavigationBottomTabBarProps,
  SafeAreaView,
} from 'react-navigation'

interface BottomTabBarProps extends NavigationBottomTabBarProps {
  jumpTo: (key: string) => void
}

class BottomTabBar extends React.PureComponent<BottomTabBarProps> {
  private onJumpToHandlers: {
    [key: string]: () => void;
  } = {}

  public render() {
    const {
      navigation: {
        state: {
          index: navigationIndex,
          routes,
        }, 
      },
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      style,
    } = this.props

    return (
      <SafeAreaView style={[styles.container, style]}>
        {routes.map((route, index) => (
          <View
            key={route.key}
            style={styles.menu}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.getOnJumpToHandler(route.key)}
            >
              {renderIcon({
                route,
                index: index,
                focused: navigationIndex === index,
                tintColor: navigationIndex === index ? activeTintColor : inactiveTintColor
              })}
            </TouchableOpacity>
          </View>
        ))}
      </SafeAreaView>
    )
  }

  private getOnJumpToHandler = (key: string) => {
    if (!Object.prototype.hasOwnProperty.call(this.onJumpToHandlers, key)) {
      this.onJumpToHandlers[key] = () => this.props.jumpTo(key)
    }

    return this.onJumpToHandlers[key]
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderTopColor: '#E0E0E0',
    borderTopWidth: 1,
  },
  menu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default BottomTabBar
