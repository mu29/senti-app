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
import {
  RecordStore,
  StoryStore,
} from 'stores';
import { palette } from 'services/style';

const AnimatedText = Animated.createAnimatedComponent(Text);

const RESET_ICON = { uri: 'ic_replay' };
const DONE_ICON = { uri: 'ic_check' };

export interface RecordControllerProps {
  recordStore?: RecordStore;
  storyStore?: StoryStore;
}

@inject('recordStore', 'storyStore')
@observer
class RecordController extends React.Component<RecordControllerProps> {
  private isEntered = false;

  private isBusy = false;

  private progressAnimation = new Animated.Value(1);

  private fadeAnimation = new Animated.Value(1);

  public componentDidMount() {
    this.props.recordStore!.reset();
  }

  public componentWillUnmount() {
    this.props.recordStore!.reset();
  }

  public render() {
    const {
      isRecorded,
      reset,
    } = this.props.recordStore!;

    return (
      <Animated.View style={styles.container}>
        <View style={styles.controller}>
          <TouchableOpacity
            onPress={reset}
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
        <AnimatedText style={[styles.hint, this.fadeStyle]}>
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
    const { data } = this.props.recordStore!;
    const { create } = this.props.storyStore!;

    if (data) {
      create(data);
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
    if (this.props.recordStore!.isRecorded) {
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
      await this.props.recordStore!.startRecord();
      this.isEntered = true;
    });
  }

  private startPlay = () => {
    this.props.recordStore!.startPlay(this.stop);
    this.isEntered = true;
  }

  private stop = () => {
    this.props.recordStore!.isRecorded ? this.stopPlay() : this.stopRecord();

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
      await this.props.recordStore!.stopRecord();
      this.isEntered = false;
      this.isBusy = false;
    });
  }

  private stopPlay = () => {
    this.props.recordStore!.stopPlay();
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
