import React from 'react'
import {
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import {
  SafeAreaView,
  BottomTabBarProps as NavigationBottomTabBarProps,
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
      <SafeAreaView
        style={[
          styles.container,
          style,
          { backgroundColor: navigationIndex === 0 ? 'rgba(0, 0, 0, 0.6)' : '#1A1A1A' },
        ]}
      >
        {routes.map((route, index) => (
          <TouchableOpacity
            key={route.key}
            style={styles.menu}
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  menu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default BottomTabBar
