import {
  PermissionsAndroid,
  Platform,
} from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';
import Sound from 'react-native-sound';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

class RecordService {
  private isRecording = false;

  private sound?: Sound;

  public start = async () => {
    if (this.isRecording) {
      return Promise.resolve();
    }

    const hasPermission = await this.requestMicrophonePermission();

    if (!hasPermission) {
      return Promise.reject({ message: LocalizedStrings.RECORD_FAILURE_REQUEST_PERMISSION });
    }

    this.release();
    this.isRecording = true;
    AnalyticsService.logEvent('click_start_record');
    return SoundRecorder.start(SoundRecorder.PATH_DOCUMENT + '/temp.aac', {
      source: Platform.select({
        ios: '',
        android: SoundRecorder.SOURCE_MIC,
      }),
      format: Platform.select({
        ios: SoundRecorder.FORMAT_MPEG4AAC,
        android: SoundRecorder.FORMAT_MPEG_4,
      }),
      encoder: Platform.select({
        ios: '',
        android: SoundRecorder.ENCODER_AAC,
      }),
    });
  }

  public stop = async (): Promise<{
    path: string;
    duration: number;
  }> => {
    try {
      const {
        path,
        duration,
      } = await SoundRecorder.stop();

      return new Promise((resolve, reject) => {
        this.sound = new Sound('temp.aac', path.replace('/temp.aac', ''), (error) => {
          if (error) {
            reject(error);
          }

          resolve({
            path,
            duration,
          });
        });
      });
    } catch (e) {
      throw e;
    } finally {
      this.isRecording = false;
      AnalyticsService.logEvent('click_stop_record');
    }
  }

  public play = (onEnd: () => void) => {
    if (this.sound && this.sound.isLoaded() && !this.sound.isPlaying()) {
      this.sound.play(onEnd);
      AnalyticsService.logEvent('click_play_recorded');
    }
  }

  public pause = () => {
    if (this.sound && this.sound.isLoaded() && this.sound.isPlaying()) {
      this.sound.stop();
      AnalyticsService.logEvent('click_pause_recorded');
    }
  }

  public release = () => {
    if (this.sound) {
      this.sound.release();
      this.sound = undefined;
    }
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
      return false;
    }
  }
}

export default new RecordService();
