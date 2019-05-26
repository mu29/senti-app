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
import {
  inject,
  observer,
} from 'mobx-react/native';
import { CreateStoryViewModel } from 'containers';
import { palette } from 'services/style';

const ALBUM_ICON = { uri: 'ic_grid' };
const CLOSE_ICON = { uri: 'ic_close' };
const TOUCH_HITSLOP = {
  top: 32,
  bottom: 32,
  left: 32,
  right: 32,
};

export interface CreateStoryHeaderProps {
  viewModel?: CreateStoryViewModel;
}

@inject('viewModel')
@observer
class CreateStoryHeader extends React.Component<CreateStoryHeaderProps & NavigationInjectedProps> {
  public render() {
    const { toggleAlbum } = this.props.viewModel!;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={toggleAlbum}
          hitSlop={TOUCH_HITSLOP}
        >
          <Animated.Image
            source={ALBUM_ICON}
            style={[styles.icon, this.fadeStyle]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.goBack}
          hitSlop={TOUCH_HITSLOP}
        >
          <Animated.Image
            source={CLOSE_ICON}
            style={[styles.icon, this.fadeStyle]}
          />
        </TouchableOpacity>
      </View>
    );
  }

  private get fadeStyle() {
    return {
      opacity: this.props.viewModel!.fadeAnimation,
    };
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
