import React, { useCallback } from 'react';
import { NavigationEvents } from 'react-navigation';
import {
  View,
  StyleSheet,
} from 'react-native';
import { withSafeArea } from 'components';
import {
  CoverModal,
  CreateStoryCover,
  CreateStoryHeader,
  CreateStoryMessage,
  CreateStoryController,
} from 'containers';
import { AnalyticsService } from 'services';

const CreateStoryScreen: React.FunctionComponent<{}> = () => {
  const onDidFocus = useCallback(() => {
    AnalyticsService.setScreen(CreateStoryScreen.name);
  }, []);

  return (
    <React.Fragment>
      <CreateStoryCover />
      <View style={styles.container}>
        <CreateStoryHeader />
        <CreateStoryMessage />
        <CreateStoryController />
      </View>
      <CoverModal />
      <NavigationEvents onDidFocus={onDidFocus} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },
});

export default withSafeArea(CreateStoryScreen);
