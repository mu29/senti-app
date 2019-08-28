import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  StoryDescription,
  withSafeArea,
} from 'components';
import {
  CoverModal,
  CreateStoryCover,
  CreateStoryHeader,
  RecordController,
} from 'containers';

const CreateStoryScreen: React.FunctionComponent<{}> = () => (
  <React.Fragment>
    <CreateStoryCover />
    <View style={styles.container}>
      <CreateStoryHeader />
      <StoryDescription />
      <RecordController onCreate={({}) => Promise.resolve()} />
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
