import {
  observable,
  computed,
} from 'mobx';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import { LoadingType } from 'constants/enums';

export class SearchState {
  @observable
  public isLoading = LoadingType.NONE;

  @observable
  public popularTags: Tag[] = [];

  @observable
  public searchTags: Tag[] = [];

  @observable
  public query = '';

  public cursor?: DocumentSnapshot;

  public searchTimeout?: NodeJS.Timeout;

  @computed
  public get tags() {
    return this.query ? this.searchTags : this.popularTags;
  }
}

export const searchState = new SearchState();
