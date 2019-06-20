import { runInAction } from 'mobx';
import firebase from 'react-native-firebase';
import { searchState } from 'stores/states';
import { LoadingType } from 'constants/enums';

export async function readPopularTagsAction() {
  if (searchState.isLoading === LoadingType.LIST) {
    return;
  }

  if (searchState.popularTags.length > 0) {
    return;
  }

  searchState.isLoading = LoadingType.LIST;

  const snapshot = await firebase.firestore()
    .collection('tags')
    .orderBy('storyCount', 'desc')
    .limit(50)
    .get();
  const tags = snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }) as Tag);

  runInAction(() => {
    searchState.popularTags = tags;
    searchState.isLoading = LoadingType.NONE;
  });
}

export async function searchTagsAction() {
  if (!searchState.query) {
    searchState.isLoading = LoadingType.NONE;
    return;
  }

  // 커서가 없고 데이터가 있는 경우 = 모든 데이터를 읽음
  if (!searchState.cursor && searchState.searchTags.length > 0) {
    return;
  }

  let query = firebase.firestore().collection('tags').where('name', '>=', searchState.query).limit(20);
  if (searchState.cursor) {
    query = query.startAfter(searchState.cursor);
  }

  const snapshot = await query.get();

  runInAction(() => {
    searchState.searchTags.push(...snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }) as Tag));
    searchState.cursor = snapshot.docs.slice(-1)[0];
    searchState.isLoading = LoadingType.NONE;
  });
}

export function updateSearchQueryAction(query: string) {
  runInAction(() => {
    if (searchState.isLoading !== LoadingType.LIST) {
      searchState.isLoading = LoadingType.LIST;
    }
    if (searchState.searchTags.length > 0) {
      searchState.searchTags = [];
    }
    searchState.query = query;
    searchState.cursor = undefined;
  });

  if (searchState.searchTimeout) {
    clearTimeout(searchState.searchTimeout);
  }
  searchState.searchTimeout = setTimeout(searchTagsAction, 1000);
}
