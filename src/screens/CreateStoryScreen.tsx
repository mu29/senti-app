import React from 'react';
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

const CreateStoryScreen: React.FunctionComponent<{}> = () => (
  <React.Fragment>
    <CreateStoryCover />
    <View style={styles.container}>
      <CreateStoryHeader />
      <CreateStoryMessage />
      <CreateStoryController />
    </View>
    <CoverModal />
  </React.Fragment>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },
});

export default withSafeArea(CreateStoryScreen);
