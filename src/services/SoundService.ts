import Sound from 'react-native-sound';

export enum SoundState {
  PLAY,
  PAUSE,
  STOP,
  LOADING,
  ERROR,
  NONE,
}

type SoundStateObserver = (state: SoundState) => void;

class SoundService {
  private sound?: Sound;

  private current = '';

  private observers = new Map<string, SoundStateObserver[]>();

  public addObserver = (key: string, observer: SoundStateObserver) => {
    const prevObservers = this.observers.get(key) || [];
    const nextObservers = prevObservers.concat(observer);
    this.observers.set(key, nextObservers);
  }

  public removeObserver = (key: string, observer: SoundStateObserver) => {
    if (Object.prototype.hasOwnProperty.call(this.observers, key)) {
      const prevObservers = this.observers.get(key) || [];
      const nextObservers = prevObservers.filter(o => o !== observer);

      if (nextObservers.length > 0) {
        this.observers.set(key, nextObservers);
      } else {
        this.observers.delete(key);
      }
    }
  }

  public play = (url: string) => {
    if (this.current === url) {
      if (this.sound && this.sound.isLoaded() && !this.sound.isPlaying()) {
        this.emit(SoundState.PLAY);
        this.sound.play(this.reset);
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

  public pause = () => {
    if (this.sound && this.sound.isLoaded() && this.sound.isPlaying()) {
      this.sound.pause();
      this.emit(SoundState.PAUSE);
    }
  }

  public replay = () => {
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

  public release = () => {
    if (this.sound && this.sound.isLoaded()) {
      this.sound.stop();
      this.sound.release();
    }

    this.emit(SoundState.NONE);
  }

  private reset = () => {
    if (this.sound && this.sound.isLoaded()) {
      this.emit(SoundState.STOP);
      this.sound.stop();
    }
  }

  private emit = (state: SoundState) => {
    const observers = this.observers.get(this.current) || [];
    observers.forEach(o => o(state));
  }
}

export default new SoundService();
