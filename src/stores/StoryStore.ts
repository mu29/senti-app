import {
  observable,
  action,
} from 'mobx';
import firebase from 'react-native-firebase';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import Sound from 'react-native-sound';
import uuidv4 from 'uuid/v4';
import { LoadingType } from 'constants/enums';
import RootStore from './RootStore';

class StoryStore {
  @observable
  public description = '';

  @observable
  public stories: Story[] = [];

  @observable
  public isLoading: LoadingType = LoadingType.NONE;

  @observable
  public current?: {
    audio: Sound;
    path: string;
    duration: number;
  };

  private cursor?: DocumentSnapshot;

  constructor(private rootStore: RootStore) {}

  @action
  public updateDescription = (text: string) => {
    this.description = text;
  }

  public readStories = async () => {
    this.isLoading = LoadingType.LIST;

    let query = firebase.firestore().collection('stories').orderBy('createdAt', 'desc');
    if (this.cursor) {
      query = query.startAfter(this.cursor);
    }

    const stories = await query.get();

    this.stories.push(...stories.docs.map(doc => Object.assign(doc.data(), { id: doc.id }) as Story));
    this.cursor = stories.docs.slice(-1)[0];
    this.isLoading = LoadingType.NONE;
  }

  public create = async ({
    path,
    duration,
  }: {
    path: string;
    duration: number;
  }) => {
    const user = this.rootStore.authStore.user;

    if (!user) {
      return;
    }

    this.isLoading = LoadingType.CREATE;

    const cover = this.rootStore.coverStore.current;
    const audio = await this.upload(path);

    const batch = firebase.firestore().batch();
    const audioRef = firebase.firestore().collection('audios').doc();
    const storyRef = firebase.firestore().collection('stories').doc();

    batch.set(audioRef, {
      duration,
      url: audio.url,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    batch.set(storyRef, {
      cover,
      description: this.description,
      tags: this.getTags(this.description).reduce((o, tag) => Object.assign(o, { [tag]: true }), {}),
      audio: {
        id: audioRef.id,
        url: audio.url,
        duration,
      },
      user: {
        id: user.uid,
        name: user.displayName,
        photoUrl: user.photoURL,
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await batch.commit();
    this.isLoading = LoadingType.NONE;
  }

  public play = (path: string, duration: number) => {
    if (this.current) {
      const {
        audio: currentAudio,
        path: currentPath,
      } = this.current;

      if (path === currentPath && currentAudio.isLoaded() && !currentAudio.isPlaying()) {
        currentAudio.play();
        return;
      }
    }

    this.isLoading = LoadingType.READ;
    this.stop();

    const audio = new Sound(path, '', (error) => {
      if (error) {
        return;
      }

      this.stop();
      this.current = {
        audio,
        path,
        duration,
      };
      this.isLoading = LoadingType.NONE;

      audio.setVolume(1);
      audio.play();
    });
  }

  public pause = () => {
    if (!this.current) {
      return;
    }

    const { audio } = this.current;

    if (audio.isLoaded() && audio.isPlaying()) {
      audio.pause();
    }
  }

  public stop = () => {
    if (this.current) {
      const { audio } = this.current;
      if (audio.isLoaded() && audio.isPlaying()) {
        audio.stop();
      }
      audio.release();
    }
  }

  private getTags(description: string) {
    return description.split(' ')
      .filter(candidate => candidate.startsWith('#'))
      .map(tag => tag.replace('#', ''));
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
