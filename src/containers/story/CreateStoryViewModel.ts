import {
  Animated,
  InteractionManager,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  observable,
  action,
} from 'mobx';
import {
  CoverStore,
  RecordStore,
  StoryStore,
} from 'stores';

class CreateStoryViewModel {
  @observable
  public isAlbumVisible = false;

  public isEntered = false;

  public progressAnimation = new Animated.Value(1);

  public fadeAnimation = new Animated.Value(1);

  public albumFadeAnimation = new Animated.Value(1);

  private isBusy = false;

  constructor(
    private coverStore: CoverStore,
    private recordStore: RecordStore,
    private storyStore: StoryStore,
  ) {}

  public get cover() {
    return this.coverStore.current;
  }

  public get covers() {
    return this.coverStore.covers;
  }

  public get isRecorded() {
    return !!this.recordStore.data;
  }

  public init = () => {
    this.coverStore.shuffle();
    this.recordStore.reset();
  }

  public clear = () => {
    this.recordStore.reset();
  }

  @action
  public toggleAlbum = () => {
    this.isAlbumVisible = !this.isAlbumVisible;

    Animated.timing(this.albumFadeAnimation, {
      toValue: Number(!this.isAlbumVisible),
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  @action
  public toggle = () => {
    if (this.isBusy) {
      return;
    }

    if (this.isEntered) {
      this.stop();
    } else {
      this.start();
    }
  }

  public updateCover = (cover: string) => {
    this.coverStore.update(cover);
  }

  public updateDescription = (text: string) => {
    this.storyStore.updateDescription(text);
  }

  public create = () => {
    const { data } = this.recordStore;

    if (!data) {
      return;
    }

    this.storyStore.create(data.path);
  }

  private start = async () => {
    if (this.isRecorded) {
      this.startPlay();
    } else {
      const granted = await this.requestMicrophonePermission();

      if (!granted) {
        return;
      }

      this.startRecord();
    }

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
  }

  private startRecord = () => {
    requestAnimationFrame(async () => {
      await this.recordStore.startRecord();
      this.isEntered = true;
    });
  }

  private startPlay = () => {
    this.recordStore.startPlay(this.stop);
    this.isEntered = true;
  }

  private stop = () => {
    this.isRecorded ? this.stopPlay() : this.stopRecord();
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

  private stopRecord = () => {
    this.isBusy = true;
    InteractionManager.runAfterInteractions(async () => {
      await this.recordStore.stopRecord();
      this.isEntered = false;
      this.isBusy = false;
    });
  }

  private stopPlay = () => {
    this.recordStore.stopPlay();
    this.isEntered = false;
  }

  private requestMicrophonePermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error(err);
    }

    return false;
  }
}

export default CreateStoryViewModel;
