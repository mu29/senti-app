import { runInAction } from 'mobx';
import firebase from 'react-native-firebase';
import { searchState } from 'stores/states';
import { LoadingType } from 'constants/enums';

export async function readPopularTagsAction() {
  if (searchState.isLoading === LoadingType.LIST) {
    return;
  }

  // 커서가 없고 데이터가 있는 경우 = 모든 데이터를 읽음
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
