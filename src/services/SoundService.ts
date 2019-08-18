import Sound from 'react-native-sound';

enum SoundState {
  NONE,
  PLAY,
  PAUSE,
  STOP,
  LOADING,
  ERROR,
}

type SoundStateObserver = (state: SoundState) => void;

class SoundService {
  private sound?: Sound;

  private current = '';

  private observers: {
    [key: string]: SoundStateObserver;
  } = {};

  public addObserver(key: string, observer: SoundStateObserver) {
    this.observers[key] = observer;
  }

  public removeObserver(key: string) {
    if (Object.prototype.hasOwnProperty.call(this.observers, key)) {
      delete this.observers[key];
    }
  }

  public play(url: string) {
    if (this.current === url) {
      if (this.sound && this.sound.isLoaded() && !this.sound.isPlaying()) {
        this.emit(SoundState.PLAY);
        this.sound.play();
      }
      return;
    }

    this.release();
    this.current = url;
    this.emit(SoundState.LOADING);

    this.sound = new Sound(url, '', (error) => {
      if (error) {
        this.emit(SoundState.ERROR);
        return;
      }

      this.emit(SoundState.PLAY);
      this.sound!.setVolume(1);
      this.sound!.play(this.reset);
    });
  }

  public pause() {
    if (this.sound && this.sound.isLoaded() && this.sound.isPlaying()) {
      this.sound.pause();
      this.emit(SoundState.PAUSE);
    }
  }

  public replay() {
    if (!this.sound) {
      return;
    }

    if (this.sound.isLoaded()) {
      this.emit(SoundState.STOP);
      this.sound.stop(() => {
        this.emit(SoundState.PLAY);
        this.sound!.play(this.reset);
      });
    }
  }

  public release() {
    if (this.sound && this.sound.isLoaded()) {
      this.sound.stop();
      this.sound.release();
    }

    this.emit(SoundState.NONE);
  }

  private reset() {
    if (this.sound && this.sound.isLoaded()) {
      this.emit(SoundState.STOP);
      this.sound.stop();
    }
  }

  private emit(state: SoundState) {
    const observer = this.observers[this.current];

    if (observer) {
      observer(state);
    }
  }
}

export default new SoundService();
