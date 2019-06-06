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
  public current?: {
    audio: Sound;
    path: string;
    duration: number;
  };

  @observable
  public timer?: NodeJS.Timeout;

  @computed
  public get isPaused() {
    return !this.timer;
  }

  public isActivated = (path: string) => {
    return this.current && this.current.path === path;
  }
}

export const audioState = new AudioState();
