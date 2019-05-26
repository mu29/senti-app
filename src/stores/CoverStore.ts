import {
  observable,
  action,
} from 'mobx';
import firebase from 'react-native-firebase';

class CoverStore {
  @observable
  public cover = '';

  @observable
  public covers: string[] = [];

  constructor() {
    this.load();
  }

  public reset = () => {
    this.shuffleCover();
  }

  @action
  public update = (cover: string) => {
    this.cover = cover;
  }

  @action
  private load = () => {
    if (this.covers.length > 0) {
      return;
    }

    firebase.firestore().collection('extras').doc('covers').get()
      .then(snapShot => this.covers = snapShot.get('urls'))
      .then(this.shuffleCover)
      .catch(console.error);
  }

  private shuffleCover = () => {
    const index = Math.floor(Math.random() * this.covers.length);
    this.update(this.covers[index]);
  }
}

export default CoverStore;
