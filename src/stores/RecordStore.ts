import {
  observable,
  computed,
} from 'mobx';
import SoundRecorder from 'react-native-sound-recorder';
import Sound from 'react-native-sound';

class RecordStore {
  private recorded?: Sound;

  @observable
  private duration: number = 0;

  @computed
  public get isRecorded() {
    return this.duration > 0;
  }

  public startRecord = () => {
    return SoundRecorder.start(SoundRecorder.PATH_DOCUMENT + '/temp.aac');
  }

  public stopRecord = async () => {
    const {
      path,
      duration,
    } = await SoundRecorder.stop();

    this.recorded = new Sound('temp.aac', path.replace('/temp.aac', ''), (error) => {
      if (error) {
        return;
      }

      this.duration = duration;
    });
  }

  public startPlay = () => {
    return new Promise((resolve, reject) => {
      if (!this.recorded || !this.recorded.isLoaded() || this.recorded.isPlaying()) {
        reject();
        return;
      }

      this.recorded.play(() => resolve());
    });
  }

  public stopPlay = () => {
    if (!this.recorded || !this.recorded.isLoaded() || !this.recorded.isPlaying()) {
      return;
    }

    this.recorded.stop();
  }
}

export default RecordStore;
