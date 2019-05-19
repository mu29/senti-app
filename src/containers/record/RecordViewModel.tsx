import { Animated } from 'react-native';
import { observable, action } from 'mobx';
import { RecordStore } from 'stores';

class RecordViewModel {
  @observable
  public isAlbumVisible: boolean = false;

  @observable
  public isEntered: boolean = false;

  private store: RecordStore;

  private progressAnimation = new Animated.Value(1);

  private fadeAnimation = new Animated.Value(1);

  constructor(store: RecordStore) {
    this.store = store;
  }

  public get isRecorded() {
    return this.store.isRecorded;
  }

  public get progressStyle() {
    return {
      transform: [{
        scale: this.progressAnimation,
      }],
    };
  }

  public get fadeStyle() {
    return {
      opacity: this.fadeAnimation,
    };
  }

  @action
  public toggleAlbum = () => {
    this.isAlbumVisible = !this.isAlbumVisible;
  }

  @action
  public toggle = () => {
    if (this.isEntered) {
      this.stop();
    } else {
      this.start();
    }
  }

  private start = async () => {
    Animated.timing(this.fadeAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(this.progressAnimation, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(this.progressAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    if (this.store.isRecorded) {
      this.store.startPlay().then(this.stop);
    } else {
      await this.store.startRecord();
    }

    this.isEntered = true;
  }

  private stop = async () => {
    if (this.store.isRecorded) {
      this.store.stopPlay();
    } else {
      await this.store.stopRecord();
    }

    this.isEntered = false;

    Animated.timing(this.fadeAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.progressAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
}

export default RecordViewModel;
