import React from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import {
  withNavigation,
  NavigationInjectedProps,
} from 'react-navigation';
import {
  Text,
  Button,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';

const BACK_ICON = { uri: 'ic_back' };

export interface HeaderProps {
  children: React.ReactNode;
  canGoBack?: boolean;
}

class Header extends React.PureComponent<HeaderProps & NavigationInjectedProps> {
  public render() {
    const {
      canGoBack,
      children,
    } = this.props;

    return (
      <View style={styles.container}>
        {canGoBack && (
          <Button onPress={this.goBack} round>
            <Image style={styles.icon} source={BACK_ICON} />
          </Button>
        )}
        <View pointerEvents="box-none" style={styles.title}>
          <Text style={typography.heading1}>
            {children}
          </Text>
        </View>
      </View>
    );
  }

  private goBack = () => {
    this.props.navigation.goBack();
  }
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomColor: palette.gray[80],
    borderBottomWidth: 0.5,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: palette.gray[50],
  },
});

export default withNavigation(Header);
