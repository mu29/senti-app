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
  RecordDescription,
  RecordController,
  RecordImageBackground,
} from 'components';
import { RecordStore } from 'stores';
import RecordViewModel from './RecordViewModel';

interface RecordContainerProps {
  recordStore?: RecordStore;
}

@inject('recordStore')
class RecordContainer extends React.Component<RecordContainerProps> {
  private recordViewModel = new RecordViewModel(this.props.recordStore!);

  componentDidMount() {
    this.recordViewModel.init();
  }

  componentWillUnmount() {
    this.recordViewModel.reset();
  }

  render() {
    return (
      <Provider viewModel={this.recordViewModel}>
        <React.Fragment>
          <RecordImageBackground />
          <View style={styles.container}>
            <RecordHeader />
            <RecordDescription />
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
