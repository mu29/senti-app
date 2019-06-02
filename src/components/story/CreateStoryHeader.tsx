import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  withNavigation,
  NavigationInjectedProps,
} from 'react-navigation';
import { showImagePickerModalAction } from 'stores/actions';
import { palette } from 'constants/style';

const ALBUM_ICON = { uri: 'ic_grid' };
const CLOSE_ICON = { uri: 'ic_close' };
const TOUCH_HITSLOP = {
  top: 32,
  bottom: 32,
  left: 32,
  right: 32,
};

class CreateStoryHeader extends React.Component<NavigationInjectedProps> {
  public render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={showImagePickerModalAction}
          hitSlop={TOUCH_HITSLOP}
        >
          <Animated.Image
            source={ALBUM_ICON}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.goBack}
          hitSlop={TOUCH_HITSLOP}
        >
          <Animated.Image
            source={CLOSE_ICON}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    );
  }

  private goBack = () => this.props.navigation.goBack();
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: palette.gray[10],
  },
});

export default withNavigation(CreateStoryHeader);
