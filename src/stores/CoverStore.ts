import {
  observable,
  action,
} from 'mobx';
import firebase from 'react-native-firebase';

class CoverStore {
  @observable
  public current = '';

  @observable
  public covers: string[] = [];

  constructor() {
    this.load();
  }

  public shuffle = () => {
    const index = Math.floor(Math.random() * this.covers.length);
    this.update(this.covers[index]);
  }

  @action
  public update = (cover: string) => {
    this.current = cover;
  }

  @action
  private load = () => {
    if (this.covers.length > 0) {
      return;
    }

    firebase.firestore().collection('extras').doc('covers').get()
      .then(snapShot => this.covers = snapShot.get('urls'))
      .then(this.shuffle)
      .catch(console.error);
  }
}

export default CoverStore;
