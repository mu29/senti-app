import { observable } from 'mobx';
import firebase from 'react-native-firebase';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import { LoadingType } from 'constants/enums';
import RootStore from './RootStore';

class ChatStore {
  @observable
  public isLoading: LoadingType = LoadingType.NONE;

  @observable
  public chattings: Chatting[] = [];

  public story?: Story;

  private cursor?: DocumentSnapshot;

  constructor(private rootStore: RootStore) { }

  public readChattings = async () => {
    if (this.isLoading === LoadingType.LIST) {
      return;
    }

    if (!this.cursor && this.chattings.length > 0) {
      return;
    }

    const { user } = this.rootStore.authStore;

    if (!user) {
      this.rootStore.uiStore.toggleAuthModal();
      return;
    }

    this.isLoading = LoadingType.LIST;

    const key = `userIds.${user.id}`;
    let query = firebase.firestore().collection('chattings').where(key, '>', 0).orderBy(key, 'desc');
    if (this.cursor) {
      query = query.startAfter(this.cursor);
    }
    query = query.limit(20);

    const chattings = await query.get();

    this.chattings.push(...chattings.docs.map(doc => Object.assign(doc.data(), { id: doc.id }) as Chatting));
    this.cursor = chattings.docs.slice(-1)[0];
    this.isLoading = LoadingType.NONE;
  }

  public create = async (data: { path: string; duration: number }) => {
    const { path, duration } = data;
    const user = this.rootStore.authStore.user;

    if (!this.story || !user) {
      return;
    }

    this.isLoading = LoadingType.CREATE;

    const audio = await this.upload(path);

    const batch = firebase.firestore().batch();
    const audioRef = firebase.firestore().collection('audios').doc();
    const chattingRef = firebase.firestore().collection('chattings').doc();
    const originMesageRef = chattingRef.collection('messages').doc();
    const messageRef = chattingRef.collection('messages').doc();

    batch.set(audioRef, {
      duration,
      url: audio.url,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    batch.set(chattingRef, {
      users: {
        [this.story.user.id]: {
          id: this.story.user.id,
          name: this.story.user.name,
          photoUrl: this.story.user.photoUrl,
        },
        [user.id]: {
          id: user.id,
          name: user.name,
          photoUrl: user.photoUrl,
        },
      },
      userIds: {
        [this.story.user.id]: this.story.createdAt.seconds * 1000,
        [user.id]: moment().valueOf(),
      },
      messageCount: 1,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    batch.set(originMesageRef, {
      audio: this.story.audio,
      user: this.story.user,
      createdAt: this.story.createdAt,
    });

    batch.set(messageRef, {
      audio: {
        id: audioRef.id,
        url: audio.url,
        duration,
      },
      user: {
        id: user.id,
        name: user.name,
        photoUrl: user.photoUrl,
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await batch.commit();
    this.isLoading = LoadingType.NONE;
    this.rootStore.uiStore.toggleReplyModal();
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

export default ChatStore;
