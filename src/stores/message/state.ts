import { observable } from 'mobx';
import { LoadingType } from 'constants/enums';

export class MessageState {
  @observable
  public isLoading = LoadingType.NONE;

  @observable
  public messages: Message[] = [];

  public chattingId?: string;

  public partnerId?: string;

  public unsubscriber?: () => void;
}

export const messageState = new MessageState();
