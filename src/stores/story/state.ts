import { observable } from 'mobx';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import { LoadingType } from 'constants/enums';

export class StoryState {
  @observable
  public isModalVisible = false;

  @observable
  public description = '';

  @observable
  public isLoading = LoadingType.NONE;

  @observable
  public storyIds: string[] = [];

  @observable
  public tagStoryIds: string[] = [];

  @observable
  public myStoryIds: string[] = [];

  @observable
  public stories: { [key: string]: Story } = {};

  public cursor?: DocumentSnapshot;

  public tagCursor?: DocumentSnapshot;

  public unsubscriber?: () => void;
}

export const storyState = new StoryState();
