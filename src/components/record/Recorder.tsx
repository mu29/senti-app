import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { palette } from 'services/style';
import { Text } from 'bootstrap';

const CLOSE_ICON = { uri: 'ic_close' };
const REDO_ICON = { uri: 'ic_replay' };
const DONE_ICON = { uri: 'ic_check' };

const CLOSE_HITSLOP = {
  top: 32,
  bottom: 32,
  left: 32,
  right: 32,
};

export interface RecorderProps {}

class Recorder extends React.PureComponent<RecorderProps> {
  render() {
    return (
      <React.Fragment>
        <TouchableOpacity hitSlop={CLOSE_HITSLOP} style={styles.close}>
          <Image source={CLOSE_ICON} style={styles.smallIcon} />
        </TouchableOpacity>
        <View style={styles.controller}>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button}>
              <Image source={REDO_ICON} style={styles.icon} />
            </TouchableOpacity>
            <View style={styles.record}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.recordButton}
              />
            </View>
            <TouchableOpacity style={styles.button}>
              <Image source={DONE_ICON} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.recordHint}>
            눌러서 녹음
          </Text>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  controller: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buttons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  recordHint: {
    margin: 16,
    color: palette.white.default,
    fontSize: 14,
    fontWeight: '600',
  },
  record: {
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
  close: {
    position: 'absolute',
    top: 8,
    right: 24,
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
  smallIcon: {
    width: 16,
    height: 16,
    tintColor: palette.gray[10],
  },
});

export default Recorder;
