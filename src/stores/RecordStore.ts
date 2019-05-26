import {
  observable,
  computed,
} from 'mobx';
import SoundRecorder from 'react-native-sound-recorder';
import Sound from 'react-native-sound';
import RootStore from './RootStore';

class RecordStore {
  @observable
  public data?: {
    audio: Sound;
    path: string;
    duration: number;
  };

  constructor(private rootStore: RootStore) {}

  @computed
  public get isRecorded() {
    return !!this.data;
  }

  public reset = () => {
    if (this.data) {
      this.data.audio.release();
      this.data = undefined;
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
      const audio = new Sound('temp.aac', path.replace('/temp.aac', ''), (error) => {
        if (error) {
          reject(error);
          return;
        }

        this.data = {
          audio,
          path,
          duration,
        };
        resolve();
      });
    });
  }

  public startPlay = (onEnd: () => void) => {
    if (!this.data) {
      return;
    }

    const { audio } = this.data;

    if (audio.isLoaded() && !audio.isPlaying()) {
      audio.play(onEnd);
    }
  }

  public stopPlay = () => {
    if (!this.data) {
      return;
    }

    const { audio } = this.data;

    if (audio.isLoaded() && audio.isPlaying()) {
      audio.stop();
    }
  }
}

export default RecordStore;
