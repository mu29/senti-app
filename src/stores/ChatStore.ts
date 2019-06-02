import { observable } from 'mobx';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';
import { LoadingType } from 'constants/enums';
import RootStore from './RootStore';

class ChatStore {
  @observable
  public isLoading: LoadingType = LoadingType.NONE;

  public story?: Story;

  constructor(private rootStore: RootStore) { }

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
      participantIds: [this.story.user.id, user.id],
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
