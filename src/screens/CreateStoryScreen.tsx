import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import {
  CreateStoryCover,
  CreateStoryHeader,
  ImagePickerModal,
  RecordController,
  StoryDescription,
  LoadingView,
  withSafeArea,
} from 'components';
import { StoryStore } from 'stores';
import { LoadingType } from 'constants/enums';

interface CreateStoryScreenProps {
  storyStore?: StoryStore;
}

const CreateStoryScreen: React.FunctionComponent<CreateStoryScreenProps> = ({
  storyStore,
}) => (
  <React.Fragment>
    {storyStore!.isLoading === LoadingType.CREATE && <LoadingView />}
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

export default withSafeArea(inject('storyStore')(observer(CreateStoryScreen)));
