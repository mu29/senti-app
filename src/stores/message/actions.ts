import { runInAction } from 'mobx';
import mergeWith from 'lodash/mergeWith';
import firebase from 'react-native-firebase';
import {
  authState,
  messageState,
} from 'stores/states';
import {
  playAudioAction,
  uploadAudioAction,
  resetRecordAction,
} from 'stores/actions';
import { LoadingType } from 'constants/enums';
import NavigationService from '../../NavigationService';

export function subscribeMessagesAction(chattingId: string, partnerId: string) {
  runInAction(() => {
    messageState.isLoading = LoadingType.LIST;
    messageState.messageIds = [];
  });

  const observer = firebase.firestore()
    .collection('chattings').doc(chattingId)
    .collection('messages')
    .orderBy('createdAt')
    .onSnapshot(snapshot => {
      const messages = snapshot.docs
        .map(doc => Object.assign(doc.data(), { id: doc.id }) as Message)
        .reduce((result, message) => Object.assign(result, { [message.id]: message }), {});

      runInAction(() => {
        mergeWith(messageState.messages, messages);
        messageState.messageIds = snapshot.docs.map(doc => doc.id !== null ? doc.id : '').filter(Boolean);
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

export async function playMessageAction(messageId: string) {
  if (messageState.isLoading !== LoadingType.NONE) {
    return;
  }

  messageState.isLoading = LoadingType.READ;

  const message = messageState.messages[messageId];

  if (!message.audio.url) {
    try {
      message.audio.url = await getAudioUrl(message.audio.id);
    } finally {
      messageState.isLoading = LoadingType.NONE;
    }
  }

  if (!message.readAt) {
    firebase.firestore()
      .collection('chattings').doc(messageState.chattingId)
      .collection('messages').doc(messageId)
      .update({ readAt: new Date().getTime() });
  }

  await playAudioAction(message.audio);

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

  resetRecordAction();
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
