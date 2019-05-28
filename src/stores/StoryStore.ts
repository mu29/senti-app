import {
  observable,
  action,
} from 'mobx';
import firebase from 'react-native-firebase';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import uuidv4 from 'uuid/v4';
import RootStore from './RootStore';

class StoryStore {
  @observable
  public description = '';

  @observable
  public stories: Story[] = [];

  @observable
  public isLoading = false;

  private cursor?: DocumentSnapshot;

  constructor(private rootStore: RootStore) {}

  @action
  public updateDescription = (text: string) => {
    this.description = text;
  }

  public readStories = async () => {
    this.isLoading = true;

    let query = firebase.firestore().collection('stories').orderBy('createdAt');
    if (this.cursor) {
      query = query.startAfter(this.cursor);
    }

    const stories = await query.get();

    this.stories.push(...stories.docs.map(doc => Object.assign(doc.data(), { id: doc.id }) as Story));
    this.cursor = stories.docs.slice(-1)[0];
    this.isLoading = false;
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
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
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
