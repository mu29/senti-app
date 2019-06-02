import { observable } from 'mobx';
import { LoadingType } from 'constants/enums';

export class CoverState {
  @observable
  public current = '';

  @observable
  public isLoading: LoadingType = LoadingType.NONE;

  @observable
  public covers: string[] = [];
}

export const coverState = new CoverState();
