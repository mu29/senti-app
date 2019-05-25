import {
  observable,
  action,
} from 'mobx';
import SoundRecorder from 'react-native-sound-recorder';
import Sound from 'react-native-sound';
import firebase from 'react-native-firebase';

class RecordStore {
  @observable
  public cover = '';

  @observable
  public covers: string[] = [];

  @observable
  public description = '';

  @observable
  public duration = 0;

  private recorded?: Sound;

  constructor() {
    this.loadCovers();
  }

  public reset = () => {
    if (this.recorded) {
      this.recorded.release();
      this.recorded = undefined;
      this.duration = 0;
    }
    this.shuffleCover();
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

  @action
  public loadCovers = () => {
    if (this.covers.length > 0) {
      return;
    }

    firebase.firestore().collection('extras').doc('covers').get()
      .then(snapShot => this.covers = snapShot.get('urls'))
      .then(this.shuffleCover)
      .catch(console.error);
  }

  @action
  public updateCover = (cover: string) => {
    this.cover = cover;
  }

  @action
  public changeDescription = (text: string) => {
    this.description = text;
  }

  private shuffleCover = () => {
    const index = Math.floor(Math.random() * this.covers.length);
    this.updateCover(this.covers[index]);
  }
}

export default RecordStore;
