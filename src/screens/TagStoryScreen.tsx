import React from 'react';
import {
  Image,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaView,
  withNavigation,
  SafeAreaViewForceInsetValue,
  NavigationScreenProps,
} from 'react-navigation';
import { Button } from 'components';
import {
  TagStoryList,
  ReplyModal,
} from 'containers';
import { palette } from 'constants/style';

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
 } = {
  top: 'always',
};

const HIT_SLOP = {
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

const BACK_ICON = { uri: 'ic_back' };

class TagStoryScreen extends React.Component<NavigationScreenProps> {
  public render() {
    const tagId = this.props.navigation.getParam('tagId', '');

    return (
      <React.Fragment>
        <TagStoryList tagId={tagId} />
        <SafeAreaView style={styles.container} forceInset={SAFE_AREA_INSET}>
          <Button onPress={this.goBack} hitSlop={HIT_SLOP} round>
            <Image style={styles.icon} source={BACK_ICON} />
          </Button>
        </SafeAreaView>
        <ReplyModal />
      </React.Fragment>
    );
  }

  private goBack = () => {
    this.props.navigation.goBack();
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 16,
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: palette.gray[20],
  },
});

export default withNavigation(TagStoryScreen);
