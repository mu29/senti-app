import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text } from 'bootstrap';
import { palette } from 'services/style';

const REDO_ICON = { uri: 'ic_replay' };
const DONE_ICON = { uri: 'ic_check' };

export interface RecordControllerProps {}

class RecordController extends React.PureComponent<RecordControllerProps> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.controller}>
          <TouchableOpacity
            style={styles.button}
          >
            <Image source={REDO_ICON} style={styles.icon} />
          </TouchableOpacity>
          <View style={styles.progress}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.record}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
          >
            <Image source={DONE_ICON} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>
          눌러서 녹음
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  controller: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  hint: {
    margin: 16,
    color: palette.white.default,
    fontSize: 14,
    fontWeight: '600',
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
  record: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: palette.red.default,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: palette.gray[10],
  },
});

export default RecordController;
