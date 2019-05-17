import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  RecordHeader,
  RecordController,
} from 'components';

export interface RecordViewProps {}

class RecordView extends React.PureComponent<RecordViewProps> {
  public render() {
    return (
      <View style={styles.container}>
        <RecordHeader />
        <RecordController />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RecordView;
