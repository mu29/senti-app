import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { palette } from 'services/style';
import { Text } from 'bootstrap';

export interface RecorderProps {}

class Recorder extends React.PureComponent<RecorderProps> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>
            변경
          </Text>
        </View>
        <View style={styles.controller}>
          <View style={styles.progress}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.recordButton}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 8,
  },
  header: {
    flexDirection: 'row',
  },
  controller: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 48,
  },
  progress: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 36,
    borderWidth: 5,
    borderColor: 'rgba(202, 57, 46, 0.5)',
  },
  recordButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: palette.red.default,
  },
});

export default Recorder;
