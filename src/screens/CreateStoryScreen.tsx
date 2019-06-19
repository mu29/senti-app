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
import { StoryState } from 'stores/states';
import { createStoryAction } from 'stores/actions';
import { LoadingType } from 'constants/enums';

interface CreateStoryScreenProps {
  storyState?: StoryState;
}

const CreateStoryScreen: React.FunctionComponent<CreateStoryScreenProps> = ({
  storyState,
}) => (
  <React.Fragment>
    {storyState!.isLoading === LoadingType.CREATE && <LoadingView />}
    <CreateStoryCover />
    <View style={styles.container}>
      <CreateStoryHeader />
      <StoryDescription />
      <RecordController create={createStoryAction} />
    </View>
    <ImagePickerModal />
  </React.Fragment>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },
});

export default withSafeArea(inject('storyState')(observer(CreateStoryScreen)));
