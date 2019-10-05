import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  withNavigation,
  NavigationInjectedProps,
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import { palette } from 'constants/style';
import { AnalyticsService } from 'services';

const ALBUM_ICON = { uri: 'ic_grid' };
const CLOSE_ICON = { uri: 'ic_close' };
const TOUCH_HITSLOP = {
  top: 32,
  bottom: 32,
  left: 32,
  right: 32,
};

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
} = {
  top: 'always',
};

interface Props extends NavigationInjectedProps {
  showCoverModal: () => void;
}

const CreateStoryHeader: React.FunctionComponent<Props> = ({
  navigation,
  showCoverModal,
}) => {
  const onPressAlbum = useCallback(() => {
    showCoverModal();
    AnalyticsService.logEvent('show_cover_modal');
  }, [showCoverModal]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <SafeAreaView
      forceInset={SAFE_AREA_INSET}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={onPressAlbum}
        hitSlop={TOUCH_HITSLOP}
      >
        <Animated.Image
          source={ALBUM_ICON}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goBack}
        hitSlop={TOUCH_HITSLOP}
      >
        <Animated.Image
          source={CLOSE_ICON}
          style={styles.icon}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 24,
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: palette.gray[10],
  },
});

export default withNavigation(React.memo(CreateStoryHeader));
