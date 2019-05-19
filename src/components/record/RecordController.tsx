import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import { Text } from 'bootstrap';
import { RecordViewModel } from 'containers';
import { palette } from 'services/style';

const AnimatedText = Animated.createAnimatedComponent(Text);

const RESET_ICON = { uri: 'ic_replay' };
const DONE_ICON = { uri: 'ic_check' };

export interface RecordControllerProps {
  viewModel?: RecordViewModel;
}

@inject('viewModel')
@observer
class RecordController extends React.Component<RecordControllerProps> {
  public render() {
    const {
      reset,
      isRecorded,
      progressStyle,
      fadeStyle,
    } = this.props.viewModel!;

    return (
      <View style={styles.container}>
        <View style={styles.controller}>
          <TouchableOpacity
            onPress={reset}
            style={styles.button}
          >
            <Animated.Image source={RESET_ICON} style={[styles.icon, fadeStyle]} />
          </TouchableOpacity>
          <View style={styles.recordContainer}>
            <Animated.View style={[styles.progress, progressStyle]} />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={this.onPressRecord}
              style={styles.record}
            />
          </View>
          <TouchableOpacity style={styles.button}>
            <Animated.Image source={DONE_ICON} style={[styles.icon, fadeStyle]} />
          </TouchableOpacity>
        </View>
        <AnimatedText style={[styles.hint, fadeStyle]}>
          눌러서 {isRecorded ? '듣기' : '녹음'}
        </AnimatedText>
      </View>
    );
  }

  private onPressRecord = () => {
    this.props.viewModel!.toggle();
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
    marginTop: 32,
    marginBottom: 16,
    color: palette.white.default,
    fontSize: 14,
    fontWeight: '600',
  },
  recordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    position: 'absolute',
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 36,
    borderWidth: 5,
    borderColor: 'rgba(202, 57, 46, 0.5)',
  },
  record: {
    position: 'absolute',
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
