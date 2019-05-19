import {
  observable,
  computed,
} from 'mobx';
import SoundRecorder from 'react-native-sound-recorder';
import Sound from 'react-native-sound';

class RecordStore {
  private recorded?: Sound;

  @observable
  private duration = 0;

  @computed
  public get isRecorded() {
    return this.duration > 0;
  }

  public reset = () => {
    if (this.recorded) {
      this.recorded.release();
      this.recorded = undefined;
      this.duration = 0;
    }
  }

  public startRecord = () => {
    return SoundRecorder.start(SoundRecorder.PATH_DOCUMENT + '/temp.aac');
  }

  public stopRecord = async () => {
    const {
      path,
      duration,
    } = await SoundRecorder.stop();

    return new Promise((resolve, reject) => {
      this.recorded = new Sound('temp.aac', path.replace('/temp.aac', ''), (error) => {
        if (error) {
          reject(error);
          return;
        }

        this.duration = duration;
        resolve();
      });
    });
  }

  public startPlay = (onEnd: () => void) => {
    if (!this.recorded || !this.recorded.isLoaded() || this.recorded.isPlaying()) {
      return;
    }

    this.recorded.play(onEnd);
  }

  public stopPlay = () => {
    if (!this.recorded || !this.recorded.isLoaded() || !this.recorded.isPlaying()) {
      return;
    }

    this.recorded.stop();
  }
}

export default RecordStore;
