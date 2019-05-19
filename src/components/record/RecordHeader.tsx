import React from 'react';
import {
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
import { RecordViewModel } from 'containers';
import { palette } from 'services/style';

const ALBUM_ICON = { uri: 'ic_grid' };
const CLOSE_ICON = { uri: 'ic_close' };
const TOUCH_HITSLOP = {
  top: 32,
  bottom: 32,
  left: 32,
  right: 32,
};

export interface RecordHeaderProps {
  viewModel?: RecordViewModel;
}

@inject('viewModel')
@observer
class RecordHeader extends React.Component<RecordHeaderProps & NavigationInjectedProps> {
  public render() {
    const { fadeStyle } = this.props.viewModel!;

    return (
      <React.Fragment>
        <TouchableOpacity
          hitSlop={TOUCH_HITSLOP}
          style={styles.album}
        >
          <Animated.Image
            source={ALBUM_ICON}
            style={[styles.icon, fadeStyle]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.goBack}
          hitSlop={TOUCH_HITSLOP}
          style={styles.close}
        >
          <Animated.Image
            source={CLOSE_ICON}
            style={[styles.icon, fadeStyle]}
          />
        </TouchableOpacity>
      </React.Fragment>
    );
  }

  private goBack = () => this.props.navigation.goBack();
}

const styles = StyleSheet.create({
  album: {
    position: 'absolute',
    top: 8,
    left: 24,
  },
  close: {
    position: 'absolute',
    top: 8,
    right: 24,
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: palette.gray[10],
  },
});

export default withNavigation(RecordHeader);
