import { observable } from 'mobx';
import { LoadingType } from 'constants/enums';

export class AudioState {
  @observable
  public isLoading = LoadingType.NONE;

  @observable
  public audios: { [key: string]: PlayableAudio } = {};

  public current?: string = undefined;

  public timer?: NodeJS.Timeout;
}

export const audioState = new AudioState();
