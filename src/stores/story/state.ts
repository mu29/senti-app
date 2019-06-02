import { observable } from 'mobx';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import Sound from 'react-native-sound';
import { LoadingType } from 'constants/enums';

export class StoryState {
  @observable
  public isModalVisible = false;

  @observable
  public description = '';

  @observable
  public current?: {
    index: number;
    audio: Sound;
    path: string;
    duration: number;
  };

  @observable
  public paused?: number;

  @observable
  public isLoading = LoadingType.NONE;

  @observable
  public stories: Story[] = [];

  public cursor?: DocumentSnapshot;
}

export const storyState = new StoryState();
