import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Provider,
  inject,
} from 'mobx-react/native';
import {
  CreateStoryCover,
  CreateStoryHeader,
  ImagePickerModal,
  RecordController,
  StoryDescription,
} from 'components';
import {
  CoverStore,
  RecordStore,
  StoryStore,
} from 'stores';
import CreateStoryViewModel from './CreateStoryViewModel';

interface RecordContainerProps {
  coverStore: CoverStore;
  recordStore: RecordStore;
  storyStore: StoryStore;
}

@inject('coverStore', 'recordStore', 'storyStore')
class RecordContainer extends React.Component<Partial<RecordContainerProps>> {
  private viewModel = new CreateStoryViewModel(
    this.props.coverStore!,
    this.props.recordStore!,
    this.props.storyStore!,
  );

  componentDidMount() {
    this.viewModel.init();
  }

  componentWillUnmount() {
    this.viewModel.clear();
  }

  render() {
    return (
      <Provider viewModel={this.viewModel}>
        <React.Fragment>
          <CreateStoryCover />
          <View style={styles.container}>
            <CreateStoryHeader />
            <StoryDescription />
            <RecordController />
          </View>
          <ImagePickerModal />
        </React.Fragment>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RecordContainer;
