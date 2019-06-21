import { runInAction } from 'mobx';
import firebase from 'react-native-firebase';
import { tagState } from 'stores/states';
import { LoadingType } from 'constants/enums';

export async function subscribeTagAction(tag: Tag) {
  if (tagState.isLoading !== LoadingType.NONE) {
    return;
  }

  tagState.isLoading = LoadingType.CREATE;

  const subscribeTag = firebase.functions().httpsCallable('subscribeTag');
  await subscribeTag({
    id: tag.id,
    name: tag.name,
  });

  tagState.isLoading = LoadingType.NONE;
}

export async function unsubscribeTagAction(tag: Tag) {
  if (tagState.isLoading !== LoadingType.NONE) {
    return;
  }

  tagState.isLoading = LoadingType.CREATE;

  const unsubscribeTag = firebase.functions().httpsCallable('unsubscribeTag');
  await unsubscribeTag({
    id: tag.id,
    name: tag.name,
  });

  tagState.isLoading = LoadingType.NONE;
}

export async function readPopularTagsAction() {
  if (tagState.isLoading !== LoadingType.NONE) {
    return;
  }

  if (tagState.popularTags.length > 0) {
    return;
  }

  tagState.isLoading = LoadingType.LIST;

  const snapshot = await firebase.firestore()
    .collection('tags')
    .orderBy('storyCount', 'desc')
    .limit(50)
    .get();
  const tags = snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }) as Tag);

  runInAction(() => {
    tagState.popularTags = tags;
    tagState.isLoading = LoadingType.NONE;
  });
}

export async function searchTagsAction() {
  if (!tagState.query) {
    tagState.isLoading = LoadingType.NONE;
    return;
  }

  // 커서가 없고 데이터가 있는 경우 = 모든 데이터를 읽음
  if (!tagState.cursor && tagState.searchTags.length > 0) {
    return;
  }

  let query = firebase.firestore().collection('tags').where('name', '>=', tagState.query).limit(20);
  if (tagState.cursor) {
    query = query.startAfter(tagState.cursor);
  }

  const snapshot = await query.get();

  runInAction(() => {
    tagState.searchTags.push(...snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }) as Tag));
    tagState.cursor = snapshot.docs.length === 20 ? snapshot.docs.slice(-1)[0] : undefined;
    tagState.isLoading = LoadingType.NONE;
  });
}

export function updateTagSearchQueryAction(query: string) {
  runInAction(() => {
    if (tagState.isLoading !== LoadingType.LIST) {
      tagState.isLoading = LoadingType.LIST;
    }
    if (tagState.searchTags.length > 0) {
      tagState.searchTags = [];
    }
    tagState.query = query;
    tagState.cursor = undefined;
  });

  if (tagState.searchTimeout) {
    clearTimeout(tagState.searchTimeout);
  }
  tagState.searchTimeout = setTimeout(searchTagsAction, 1000);
}
