import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  CreateStoryCover,
  CreateStoryHeader,
  ImagePickerModal,
  RecordController,
  StoryDescription,
  withSafeArea,
} from 'components';

const CreateStoryScreen = () => (
  <React.Fragment>
    <CreateStoryCover />
    <View style={styles.container}>
      <CreateStoryHeader />
      <StoryDescription />
      <RecordController />
    </View>
    <ImagePickerModal />
  </React.Fragment>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withSafeArea(CreateStoryScreen);
