import { observable } from 'mobx';
import { LoadingType } from 'constants/enums';

export class MessageState {
  @observable
  public isLoading = LoadingType.NONE;

  @observable
  public messageIds: string[] = [];

  @observable
  public messages: { [key: string]: Message } = {};

  public chattingId?: string;

  public partnerId?: string;

  public unsubscriber?: () => void;
}

export const messageState = new MessageState();
