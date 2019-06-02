import {
  observable,
  computed,
} from 'mobx';
import Sound from 'react-native-sound';

export class RecordState {
  @observable
  public data?: {
    audio: Sound;
    path: string;
    duration: number;
  };

  @computed
  public get isRecorded() {
    return !!this.data;
  }
}

export const recordState = new RecordState();
