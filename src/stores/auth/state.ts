import {
  observable,
  computed,
} from 'mobx';
import { LoadingType } from 'constants/enums';

export class AuthState {
  @observable
  public isModalVisible = false;

  @observable
  public user?: User;

  @observable
  public currentProvider?: 'google' | 'facebook';

  @observable
  public isLoading = LoadingType.NONE;

  public nextRoute?: string;

  @computed
  public get isLoggedIn() {
    return this.user !== undefined;
  }
}

export const authState = new AuthState();
