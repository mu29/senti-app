import {
  PermissionsAndroid,
  Platform,
} from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';
import Sound from 'react-native-sound';

class RecordService {
  private sound?: Sound;

  public start = () => {
    if (!this.requestMicrophonePermission()) {
      return;
    }

    this.release();
    SoundRecorder.start(SoundRecorder.PATH_DOCUMENT + '/temp.aac');
  }

  public stop = async (): Promise<{
    path: string;
    duration: number;
  }> => {
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
  }

  public play = (onEnd: () => void) => {
    if (this.sound && this.sound.isLoaded() && !this.sound.isPlaying()) {
      this.sound.play(onEnd);
    }
  }

  public pause = () => {
    if (this.sound && this.sound.isLoaded() && this.sound.isPlaying()) {
      this.sound.stop();
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
      console.error(err);
    }

    return false;
  }
}

export default new RecordService();
