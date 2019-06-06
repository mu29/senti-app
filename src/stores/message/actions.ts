import { runInAction } from 'mobx';
import firebase from 'react-native-firebase';
import {
  authState,
  messageState,
} from 'stores/states';
import { playAudioAction } from 'stores/actions';
import { LoadingType } from 'constants/enums';
import NavigationService from '../../NavigationService';

export function subscribeMessagesAction(chattingId: string) {
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

  await playAudioAction(messageState.messages[index].audio.url);

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
