import { runInAction } from 'mobx';
import mergeWith from 'lodash/mergeWith';
import firebase from 'react-native-firebase';
import {
  authState,
  coverState,
  storyState,
} from 'stores/states';
import {
  showAuthModalAction,
  uploadAudioAction,
} from 'stores/actions';
import { LoadingType } from 'constants/enums';
import NavigationService from '../../NavigationService';

export function showImagePickerModalAction() {
  storyState.isModalVisible = true;
}

export function hideImagePickerModalAction() {
  storyState.isModalVisible = false;
}

export function updateDescriptionAction(description: string) {
  storyState.description = description;
}

export async function readStoriesAction() {
  if (storyState.isLoading === LoadingType.LIST) {
    return;
  }

  // 커서가 없고 데이터가 있는 경우 = 모든 데이터를 읽음
  if (!storyState.cursor && storyState.storyIds.length > 0) {
    return;
  }

  storyState.isLoading = LoadingType.LIST;

  let query = firebase.firestore().collection('stories').orderBy('createdAt', 'desc').limit(10);
  if (storyState.cursor) {
    query = query.startAfter(storyState.cursor);
  }

  const snapshot = await query.get();
  const stories = snapshot.docs
    .map(doc => Object.assign(doc.data(), { id: doc.id }) as Story)
    .reduce((result, story) => Object.assign(result, { [story.id]: story }), {});

  runInAction(() => {
    mergeWith(storyState.stories, stories);
    storyState.storyIds.push(...snapshot.docs.map(doc => doc.id !== null ? doc.id : '').filter(Boolean));
    storyState.cursor = snapshot.docs.slice(-1)[0];
    storyState.isLoading = LoadingType.NONE;
  });
}

export async function createStoryAction(path: string, duration: number) {
  const { user } = authState;

  if (!user) {
    showAuthModalAction();
    return;
  }

  storyState.isLoading = LoadingType.CREATE;

  const now = new Date().getTime();
  const cover = coverState.current;
  const audio = await uploadAudioAction(path);

  const batch = firebase.firestore().batch();
  const audioRef = firebase.firestore().collection('audios').doc();
  const storyRef = firebase.firestore().collection('stories').doc();

  batch.set(audioRef, {
    duration,
    url: audio.url,
    user: {
      id: user.id,
    },
    createdAt: now,
    updatedAt: now,
  });

  batch.set(storyRef, {
    cover,
    description: storyState.description,
    tags: getTags(storyState.description).reduce((o, tag) => Object.assign(o, { [tag]: now }), {}),
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
    updatedAt: now,
  });

  await batch.commit();

  storyState.isLoading = LoadingType.NONE;
  NavigationService.goBack();
}

function getTags(description: string) {
  return description.split(/\s/)
    .filter(candidate => candidate.startsWith('#'))
    .map(tag => tag.replace('#', ''));
}
