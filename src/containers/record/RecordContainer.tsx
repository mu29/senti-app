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
  ImagePickerModal,
  RecordHeader,
  RecordController,
} from 'components';
import { RecordStore } from 'stores';
import RecordViewModel from './RecordViewModel';

interface RecordContainerProps {
  recordStore?: RecordStore;
}

@inject('recordStore')
class RecordContainer extends React.Component<RecordContainerProps> {
  private recordViewModel = new RecordViewModel(this.props.recordStore!);

  componentWillUnmount() {
    this.recordViewModel.reset();
  }

  render() {
    return (
      <Provider viewModel={this.recordViewModel}>
        <View style={styles.container}>
          <RecordHeader />
          <RecordController />
          <ImagePickerModal />
        </View>
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
