import {
  observable,
  action,
} from 'mobx';
import firebase from 'react-native-firebase';
import { LoadingType } from 'constants/enums';
import RootStore from './RootStore';

class CoverStore {
  @observable
  public current = '';

  @observable
  public covers: string[] = [];

  @observable
  public isLoading: LoadingType = LoadingType.NONE;

  constructor(private rootStore: RootStore) {
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

    this.isLoading = LoadingType.LIST;

    firebase.firestore().collection('extras').doc('covers').get()
      .then(snapShot => this.covers = snapShot.get('urls'))
      .then(this.shuffle)
      .then(() => this.isLoading = LoadingType.NONE)
      .catch(console.error);
  }
}

export default CoverStore;
