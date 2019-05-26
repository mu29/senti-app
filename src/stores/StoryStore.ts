import {
  observable,
  action,
} from 'mobx';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';
import RootStore from './RootStore';

class StoryStore {
  @observable
  public description = '';

  constructor(private rootStore: RootStore) {}

  @action
  public updateDescription = (text: string) => {
    this.description = text;
  }

  public create = async (audioPath: string) => {
    const user = this.rootStore.authStore.user;

    if (!user) {
      return;
    }

    const cover = this.rootStore.coverStore.current;
    const audio = await this.upload(audioPath);

    firebase.firestore().collection('stories').doc().set({
      cover,
      description: this.description,
      tags: this.tags.reduce((o, tag) => Object.assign(o, { [tag.replace('#', '')]: true }), {}),
      audio: {
        id: audio.id,
        url: audio.url,
      },
      user: {
        id: user.uid,
        name: user.displayName,
        photoUrl: user.photoURL,
      },
    });
  }

  private get tags() {
    return this.description.split(' ').filter(candidate => candidate.startsWith('#'));
  }

  private upload = async (audioPath: string) => {
    const id = uuidv4();
    const snapshot = await firebase.storage()
      .ref(`audios/${id}.aac`)
      .putFile(audioPath);

    return {
      id,
      url: snapshot.downloadURL,
    };
  }
}

export default StoryStore;
