import { Animated } from 'react-native';
import { observable, action } from 'mobx';
import { RecordStore } from 'stores';

class RecordViewModel {
  @observable
  public isAlbumVisible: boolean = false;

  @observable
  public isRecording: boolean = false;

  private store: RecordStore;

  private progressAnimation = new Animated.Value(1);

  private fadeAnimation = new Animated.Value(1);

  constructor(store: RecordStore) {
    this.store = store;
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
  public toggleRecording = () => {
    this.isRecording = !this.isRecording;

    this.animateFade();
    this.animateProgress();
  }

  private animateFade = () => {
    Animated.timing(this.fadeAnimation, {
      toValue: Number(!this.isRecording),
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  private animateProgress = () => {
    if (this.isRecording) {
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
    } else {
      Animated.timing(this.progressAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }
}

export default RecordViewModel;
