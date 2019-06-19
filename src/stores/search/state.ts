import { observable } from 'mobx';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import { LoadingType } from 'constants/enums';

export class SearchState {
  @observable
  public isLoading = LoadingType.NONE;

  @observable
  public popularTags: Tag[] = [];

  @observable
  public tags: Tag[] = [];

  public cursor?: DocumentSnapshot;
}

export const searchState = new SearchState();
