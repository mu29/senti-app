import { runInAction } from 'mobx';
import firebase from 'react-native-firebase';
import {
  authState,
  chattingState
} from 'stores/states';
import {
  showAuthModalAction,
  uploadAudioAction,
} from 'stores/actions';
import { LoadingType } from 'constants/enums';

export function showReplyModalAction() {
  chattingState.isModalVisible = true;
}

export function hideReplyModalAction() {
  chattingState.isModalVisible = false;
}

export function subscribeChattingsAction() {
  const { user } = authState;

  if (!user) {
    showAuthModalAction();
    return;
  }

  chattingState.isLoading = LoadingType.LIST;

  const key = `userIds.${user.id}`;
  const observer = firebase.firestore()
    .collection('chattings')
    .where(key, '>', 0)
    .orderBy(key, 'desc')
    .onSnapshot(snapshot => {
      runInAction(() => {
        chattingState.chattings = snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }) as Chatting);
        if (chattingState.isLoading !== LoadingType.NONE) {
          chattingState.isLoading = LoadingType.NONE;
        }
      });
    });

  chattingState.unsubscriber = observer;
}

export function unsubscribeChattingsAction() {
  if (chattingState.unsubscriber) {
    chattingState.unsubscriber();
  }
}

export async function createChattingAction(path: string, duration: number) {
  const { user } = authState;
  const { story } = chattingState;

  if (!story || !user || story.user === user) {
    return;
  }

  chattingState.isLoading = LoadingType.CREATE;

  const now = new Date().getTime();
  const audio = await uploadAudioAction(path);

  const batch = firebase.firestore().batch();
  const audioRef = firebase.firestore().collection('audios').doc();
  const chattingRef = firebase.firestore().collection('chattings').doc();
  const originMesageRef = chattingRef.collection('messages').doc();
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

  batch.set(chattingRef, {
    users: {
      [story.user.id]: {
        id: story.user.id,
        name: story.user.name,
        photoUrl: story.user.photoUrl,
      },
      [user.id]: {
        id: user.id,
        name: user.name,
        photoUrl: user.photoUrl,
      },
    },
    userIds: {
      [story.user.id]: now,
      [user.id]: now,
    },
    unreadMessageCount: {
      [story.user.id]: 0,
      [user.id]: 0,
    },
    messageCount: 2,
    createdAt: now,
    updatedAt: now,
  });

  batch.set(originMesageRef, {
    audio: story.audio,
    user: story.user,
    createdAt: story.createdAt,
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

  chattingState.isLoading = LoadingType.NONE;
  hideReplyModalAction();
}

export function setCurrentStoryAction(story: Story) {
  chattingState.story = story;
}
