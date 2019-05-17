import React from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  withNavigation,
  NavigationInjectedProps,
} from 'react-navigation';
import { palette } from 'services/style';

const ALBUM_ICON = { uri: 'ic_grid' };
const CLOSE_ICON = { uri: 'ic_close' };
const TOUCH_HITSLOP = {
  top: 32,
  bottom: 32,
  left: 32,
  right: 32,
};

export interface RecordHeaderProps {}

class RecordHeader extends React.PureComponent<RecordHeaderProps & NavigationInjectedProps> {
  public render() {
    return (
      <React.Fragment>
        <TouchableOpacity
          hitSlop={TOUCH_HITSLOP}
          style={styles.album}
        >
          <Image
            source={ALBUM_ICON}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.goBack}
          hitSlop={TOUCH_HITSLOP}
          style={styles.close}
        >
          <Image
            source={CLOSE_ICON}
            style={styles.icon}
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
