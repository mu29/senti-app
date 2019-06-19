import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  InteractionManager,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import { Text } from 'components';
import { RecordState } from 'stores/states';
import {
  resetRecordAction,
  startRecordAction,
  stopRecordAction,
  startPlayRecordAction,
  stopPlayRecordAction,
} from 'stores/actions';
import {
  palette,
  typography,
} from 'constants/style';

const AnimatedText = Animated.createAnimatedComponent(Text);

const RESET_ICON = { uri: 'ic_replay' };
const DONE_ICON = { uri: 'ic_check' };

export interface RecordControllerProps {
  recordState?: RecordState;
  create: (path: string, duration: number) => Promise<void>;
}

@inject('recordState')
@observer
class RecordController extends React.Component<RecordControllerProps> {
  private isEntered = false;

  private isBusy = false;

  private progressAnimation = new Animated.Value(1);

  private fadeAnimation = new Animated.Value(1);

  public componentDidMount() {
    resetRecordAction();
  }

  public componentWillUnmount() {
    resetRecordAction();
  }

  public render() {
    const { isRecorded } = this.props.recordState!;

    return (
      <Animated.View style={styles.container}>
        <View style={styles.controller}>
          <TouchableOpacity
            onPress={resetRecordAction}
            disabled={!isRecorded}
            style={[styles.button, isRecorded && styles.enabled]}
          >
            <Animated.Image source={RESET_ICON} style={[styles.icon, this.fadeStyle]} />
          </TouchableOpacity>
          <View style={styles.recordContainer}>
            <Animated.View style={[styles.progress, this.progressStyle]} />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={this.toggle}
              style={styles.record}
            />
          </View>
          <TouchableOpacity
            onPress={this.create}
            disabled={!isRecorded}
            style={[styles.button, isRecorded && styles.enabled]}
          >
            <Animated.Image source={DONE_ICON} style={[styles.icon, this.fadeStyle]} />
          </TouchableOpacity>
        </View>
        <AnimatedText style={[typography.heading4, styles.hint, this.fadeStyle]}>
          눌러서 {isRecorded ? '듣기' : '녹음'}
        </AnimatedText>
      </Animated.View>
    );
  }

  private get progressStyle() {
    return {
      transform: [{
        scale: this.progressAnimation,
      }],
    };
  }

  private get fadeStyle() {
    return {
      opacity: this.fadeAnimation,
    };
  }

  private create = () => {
    const {
      create,
      recordState,
    } = this.props;

    if (recordState!.data) {
      const {
        path,
        duration,
      } = recordState!.data;

      create(path, duration);
    }
  }

  private toggle = () => {
    if (this.isBusy) {
      return;
    }

    if (this.isEntered) {
      this.stop();
    } else {
      this.start();
    }
  }

  private start = async () => {
    if (this.props.recordState!.isRecorded) {
      this.startPlay();
    } else {
      if (!await this.requestMicrophonePermission()) {
        return;
      }

      this.startRecord();
    }

    Animated.timing(this.fadeAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(this.progressAnimation, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(this.progressAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }

  private startRecord = () => {
    requestAnimationFrame(async () => {
      await startRecordAction();
      this.isEntered = true;
    });
  }

  private startPlay = () => {
    startPlayRecordAction(this.stop);
    this.isEntered = true;
  }

  private stop = () => {
    this.props.recordState!.isRecorded ? this.stopPlay() : this.stopRecord();

    Animated.timing(this.fadeAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.progressAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  private stopRecord = () => {
    this.isBusy = true;
    InteractionManager.runAfterInteractions(async () => {
      await stopRecordAction();
      this.isEntered = false;
      this.isBusy = false;
    });
  }

  private stopPlay = () => {
    stopPlayRecordAction();
    this.isEntered = false;
  }

  private requestMicrophonePermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error(err);
    }

    return false;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  controller: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  hint: {
    marginTop: 32,
    color: palette.white.default,
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
    borderColor: palette.transparent.red.default,
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
    opacity: 0.5,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: palette.gray[10],
  },
  enabled: {
    opacity: 1,
  },
});

export default RecordController;
