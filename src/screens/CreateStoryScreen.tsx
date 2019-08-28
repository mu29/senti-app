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
  ImagePickerModal,
  StoryDescription,
  LoadingLayer,
  withSafeArea,
} from 'components';
import {
  CreateStoryCover,
  CreateStoryHeader,
  RecordController,
} from 'containers';
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
    {storyState!.isLoading === LoadingType.CREATE && <LoadingLayer />}
    <CreateStoryCover />
    <View style={styles.container}>
      <CreateStoryHeader />
      <StoryDescription />
      {/* <RecordController onCreate={createStoryAction} /> */}
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
