import {
  observable,
  computed,
} from 'mobx';
import Sound from 'react-native-sound';
import { LoadingType } from 'constants/enums';

export class AudioState {
  @observable
  public isLoading = LoadingType.NONE;

  @observable
  public audio?: Sound;

  @observable
  public path?: string;

  @observable
  public duration = 0;

  @observable
  public timer?: NodeJS.Timeout;

  @computed
  public get isPaused() {
    return !this.timer;
  }

  public isPlaying = (path: string) => {
    return this.path === path;
  }
}

export const audioState = new AudioState();
