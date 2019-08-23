import Sound from 'react-native-sound';

export enum AudioState {
  PLAY,
  PAUSE,
  STOP,
  LOADING,
  ERROR,
  NONE,
}

type AudioStateObserver = (state: AudioState) => void;

class AudioService {
  private sound?: Sound;

  private current = '';

  private observers = new Map<string, AudioStateObserver[]>();

  public addObserver = (key: string, observer: AudioStateObserver) => {
    const prevObservers = this.observers.get(key) || [];
    const nextObservers = prevObservers.concat(observer);
    this.observers.set(key, nextObservers);
  }

  public removeObserver = (key: string, observer: AudioStateObserver) => {
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

  public play = (url: string): Promise<boolean> => {
    if (this.current === url) {
      if (this.sound && this.sound.isLoaded() && !this.sound.isPlaying()) {
        return new Promise((resolve) => {
          this.emit(AudioState.PLAY);
          this.sound!.play(this.reset);
          resolve(true);
        });
      }
    }

    this.release();
    this.current = url;
    this.emit(AudioState.LOADING);

    return new Promise((resolve, reject) => {
      this.sound = new Sound(url, '', (error) => {
        if (error) {
          this.emit(AudioState.ERROR);
          return reject(error);
        }

        this.emit(AudioState.PLAY);
        this.sound!.setVolume(1);
        this.sound!.play(this.reset);

        resolve(true);
      });
    });
  }

  public pause = () => {
    if (this.sound && this.sound.isLoaded() && this.sound.isPlaying()) {
      this.sound.pause();
      this.emit(AudioState.PAUSE);
    }
  }

  public replay = () => {
    if (!this.sound) {
      return;
    }

    if (this.sound.isLoaded()) {
      this.emit(AudioState.STOP);
      this.sound.stop(() => {
        this.emit(AudioState.PLAY);
        this.sound!.play(this.reset);
      });
    }
  }

  public release = () => {
    if (this.sound && this.sound.isLoaded()) {
      this.sound.stop();
      this.sound.release();
    }

    this.emit(AudioState.NONE);
  }

  private reset = () => {
    if (this.sound && this.sound.isLoaded()) {
      this.emit(AudioState.STOP);
      this.sound.stop();
    }
  }

  private emit = (state: AudioState) => {
    const observers = this.observers.get(this.current) || [];
    observers.forEach(o => o(state));
  }
}

export default new AudioService();
