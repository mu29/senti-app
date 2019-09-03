import React, { useCallback } from 'react';
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
import { MyStoryList } from 'containers';
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

const MyStoryScreen: React.FunctionComponent<NavigationScreenProps> = ({
  navigation,
}) => {
  const goBack = useCallback(() => navigation.goBack(), []);

  const index = navigation.getParam('index', 0);

  return (
    <React.Fragment>
      <MyStoryList initialIndex={index} />
      <SafeAreaView style={styles.container} forceInset={SAFE_AREA_INSET}>
        <Button onPress={goBack} hitSlop={HIT_SLOP} round>
          <Image style={styles.icon} source={BACK_ICON} />
        </Button>
      </SafeAreaView>
    </React.Fragment>
  );
};

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

export default withNavigation(MyStoryScreen);
