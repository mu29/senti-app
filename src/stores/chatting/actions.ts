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

export async function readChattingsAction() {
  if (chattingState.isLoading === LoadingType.LIST) {
    return;
  }

  // 커서가 없고 데이터가 있는 경우 = 모든 데이터를 읽음
  if (!chattingState.cursor && chattingState.chattings.length > 0) {
    return;
  }

  const { user } = authState;

  if (!user) {
    showAuthModalAction();
    return;
  }

  chattingState.isLoading = LoadingType.LIST;

  const key = `userIds.${user.id}`;
  let query = firebase.firestore().collection('chattings').where(key, '>', 0).orderBy(key, 'desc').limit(10);
  if (chattingState.cursor) {
    query = query.startAfter(chattingState.cursor);
  }

  const snapShot = await query.get();
  const chattings = snapShot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }) as Chatting);

  runInAction(() => {
    chattingState.chattings.push(...chattings);
    chattingState.cursor = snapShot.docs.slice(-1)[0];
    chattingState.isLoading = LoadingType.NONE;
  });
}

export async function createChattingAction(path: string, duration: number) {
  const { user } = authState;
  const { story } = chattingState;

  if (!story || !user) {
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
      [story.user.id]: story.createdAt,
      [user.id]: now,
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
      url: audio.url,
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
