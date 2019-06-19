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

export async function refreshChattingsAction(showRefreshing: boolean = true) {
  if (chattingState.isLoading === LoadingType.REFRESH
    || chattingState.isLoading === LoadingType.LIST) {
    return;
  }

  const { user } = authState;

  if (!user) {
    showAuthModalAction();
    return;
  }

  chattingState.cursor = undefined;
  chattingState.isLoading = showRefreshing ? LoadingType.REFRESH : LoadingType.LIST;

  const {
    chattings,
    cursor,
  } = await readChattings();

  runInAction(() => {
    chattingState.chattings = chattings;
    chattingState.cursor = cursor;
    chattingState.isLoading = LoadingType.NONE;

    if (!chattingState.isInitialLoaded) {
      chattingState.isInitialLoaded = true;
    }
  });
}

export async function readChattingsAction() {
  if (chattingState.isLoading === LoadingType.REFRESH
    || chattingState.isLoading === LoadingType.LIST) {
    return;
  }

  // 커서가 없고 데이터가 있는 경우 = 모든 데이터를 읽음
  if (!chattingState.cursor && chattingState.chattings.length > 0) {
    return;
  }

  chattingState.isLoading = LoadingType.LIST;

  const {
    chattings,
    cursor,
  } = await readChattings();

  runInAction(() => {
    chattingState.chattings.push(...chattings);
    chattingState.cursor = cursor;
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
    readAt: now,
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

async function readChattings() {
  const { user } = authState;

  if (!user) {
    return {
      chattings: [],
      cursor: undefined,
    };
  }

  const key = `userIds.${user.id}`;
  let query = firebase.firestore().collection('chattings').where(key, '>', 0).orderBy(key, 'desc').limit(10);
  if (chattingState.cursor) {
    query = query.startAfter(chattingState.cursor);
  }

  const snapshot = await query.get();
  const chattings = snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }) as Chatting);

  return {
    chattings,
    cursor: snapshot.docs.slice(-1)[0],
  };
}
