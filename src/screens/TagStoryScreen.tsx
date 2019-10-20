import React, { useCallback } from 'react';
import {
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {
  SafeAreaView,
  withNavigation,
  NavigationEvents,
  SafeAreaViewForceInsetValue,
  NavigationScreenProps,
} from 'react-navigation';
import { Button } from 'components';
import {
  TagStoryList,
  ReplyModal,
} from 'containers';
import { palette } from 'constants/style';
import {
  AudioService,
  AnalyticsService,
} from 'services';

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

const TagStoryScreen: React.FunctionComponent<NavigationScreenProps> = ({
  navigation,
}) => {
  const onDidFocus = useCallback(() => {
    AnalyticsService.setScreen('TagStoryScreen');
  }, []);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const tagId = navigation.getParam('tagId', '');

  return (
    <React.Fragment>
      <TagStoryList tagId={tagId} />
      <SafeAreaView style={styles.container} forceInset={SAFE_AREA_INSET}>
        <Button onPress={goBack} hitSlop={HIT_SLOP} round>
          <Image style={styles.icon} source={BACK_ICON} />
        </Button>
      </SafeAreaView>
      <ReplyModal />
      <NavigationEvents onDidFocus={onDidFocus} />
      <NavigationEvents onWillBlur={AudioService.pause} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    height: 48,
    marginTop: (StatusBar.currentHeight || 0),
    paddingHorizontal: 16,
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: palette.gray[20],
  },
});

export default withNavigation(TagStoryScreen);
