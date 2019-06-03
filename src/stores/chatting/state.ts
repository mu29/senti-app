import { observable } from 'mobx';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import { LoadingType } from 'constants/enums';

export class ChattingState {
  @observable
  public isModalVisible = false;

  @observable
  public isLoading = LoadingType.NONE;

  @observable
  public isInitialLoaded = false;

  @observable
  public chattings: Chatting[] = [];

  public cursor?: DocumentSnapshot;

  public story?: Story;
}

export const chattingState = new ChattingState();
