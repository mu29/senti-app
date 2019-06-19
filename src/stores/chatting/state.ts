import { observable } from 'mobx';
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

  public story?: Story;

  public unsubscriber?: () => void;
}

export const chattingState = new ChattingState();
