import { runInAction } from 'mobx';
import firebase from 'react-native-firebase';
import { messageState } from 'stores/states';
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
