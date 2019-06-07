import { runInAction } from 'mobx';
import firebase from 'react-native-firebase';
import {
  authState,
  messageState,
} from 'stores/states';
import {
  playAudioAction,
  uploadAudioAction,
} from 'stores/actions';
import { LoadingType } from 'constants/enums';
import NavigationService from '../../NavigationService';

export function subscribeMessagesAction(chattingId: string, partnerId: string) {
  runInAction(() => {
    messageState.isLoading = LoadingType.LIST;
    messageState.messages = [];
  });

  const observer = firebase.firestore()
    .collection('chattings').doc(chattingId)
    .collection('messages')
    .orderBy('createdAt')
    .onSnapshot(snapshot => {
      runInAction(() => {
        messageState.messages = snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }) as Message);
        if (messageState.isLoading !== LoadingType.NONE) {
          messageState.isLoading = LoadingType.NONE;
        }
      });
    }, () => {
      NavigationService.goBack();
    });

  messageState.chattingId = chattingId;
  messageState.partnerId = partnerId;
  messageState.unsubscriber = observer;
}

export function unsubscribeMessagesAction() {
  if (messageState.unsubscriber) {
    messageState.unsubscriber();
  }
}

export async function playMessageAction(index: number) {
  if (messageState.isLoading !== LoadingType.NONE) {
    return;
  }

  messageState.isLoading = LoadingType.READ;

  if (!messageState.messages[index].audio.url) {
    const audioId = messageState.messages[index].audio.id;
    const audioUrl = await getAudioUrl(audioId);

    messageState.messages[index].audio.url = audioUrl;
  }

  if (!messageState.messages[index].readAt) {
    readMessage(messageState.messages[index]);
  }

  await playAudioAction(messageState.messages[index].audio.url);

  messageState.isLoading = LoadingType.NONE;
}

export async function createMessageAction(path: string, duration: number) {
  const { user } = authState;
  const {
    chattingId,
    partnerId,
  } = messageState;

  if (!user || !partnerId || !chattingId) {
    return;
  }

  messageState.isLoading = LoadingType.CREATE;

  const now = new Date().getTime();
  const audio = await uploadAudioAction(path);

  const batch = firebase.firestore().batch();
  const audioRef = firebase.firestore().collection('audios').doc();
  const chattingRef = firebase.firestore().collection('chattings').doc(chattingId);
  const messageRef = chattingRef.collection('messages').doc();

  batch.set(audioRef, {
    duration,
    url: audio.url,
    user: {
      id: user.id,
    },
    createdAt: now,
    updatedAt: now,
  });

  batch.update(chattingRef, {
    userIds: {
      [partnerId]: now,
      [user.id]: now,
    },
    messageCount: firebase.firestore.FieldValue.increment(1),
    unreadMessageCount: {
      [partnerId]: firebase.firestore.FieldValue.increment(1),
      [user.id]: firebase.firestore.FieldValue.increment(0),
    },
    updatedAt: now,
  });

  batch.set(messageRef, {
    audio: {
      id: audioRef.id,
      duration,
    },
    user: {
      id: user.id,
      name: user.name,
      photoUrl: user.photoUrl,
    },
    createdAt: now,
  });

  await batch.commit();

  messageState.isLoading = LoadingType.NONE;
}

async function getAudioUrl(audioId: string) {
  const { user } = authState;

  if (!user) {
    return '';
  }

  const getAudioInfo = firebase.functions().httpsCallable('getAudioInfo');
  const { data } = await getAudioInfo({ id: audioId });

  return data.url;
}

async function readMessage(message: Message) {
  const { user } = authState;
  const {
    chattingId,
    partnerId,
  } = messageState;

  if (!user || !chattingId || !partnerId || message.user.id === user.id) {
    return;
  }

  const batch = firebase.firestore().batch();
  const chattingRef = firebase.firestore().collection('chattings').doc(chattingId);
  const messageRef = chattingRef.collection('messages').doc(message.id);

  batch.set(chattingRef, {
    unreadMessageCount: {
      [user.id]: firebase.firestore.FieldValue.increment(-1),
    },
  }, { merge: true });

  batch.set(messageRef, {
    readAt: new Date().getTime(),
  }, { merge: true });

  await batch.commit();
}
