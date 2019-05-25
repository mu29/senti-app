import {
  observable,
  action,
} from 'mobx';
import SoundRecorder from 'react-native-sound-recorder';
import Sound from 'react-native-sound';
import firebase from 'react-native-firebase';

class RecordStore {
  @observable
  public backgroundResource = '';

  @observable
  public coverUrls: string[] = [];

  @observable
  public description = '';

  @observable
  public duration = 0;

  private recorded?: Sound;

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

  @action
  public loadCovers = () => {
    firebase.firestore().collection('covers').get()
      .then(snapShot => snapShot.docs.map(doc => doc.get('fileName')))
      .then(files => Promise.all(files.map(file => firebase.storage().ref(`covers/${file}`).getDownloadURL())))
      .then(urls => this.coverUrls = urls)
      .then(urls => this.changeBackgroundResource(urls[Math.floor(Math.random() * urls.length)]))
      .catch(e => console.error(e));
  }

  @action
  public changeBackgroundResource = (url: string) => {
    this.backgroundResource = url;
  }

  @action
  public changeDescription = (text: string) => {
    this.description = text;
  }
}

export default RecordStore;
