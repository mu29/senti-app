import React from 'react';
import Sound from 'react-native-sound';

interface Audio {
  url: string;
  sound?: Sound;
  elapsedTime: number;
  isPlaying: boolean;
}

interface ContextProps {
  current: string;
  audios: {
    [key: string]: Audio;
  };
}

const {
  Provider,
  Consumer,
} = React.createContext<ContextProps>({
  current: '',
  audios: {},
});

export class AudioProvider extends React.Component<{}, ContextProps> {
  public state: ContextProps = {
    current: '',
    audios: {},
  };

  private timer?: NodeJS.Timer;

  private rejector?: (reason?: any) => void;

  public render() {
    const { children } = this.props;

    return (
      <Provider
        value={Object.assign(this.state, {
          play: this.play,
          replay: this.replay,
          pause: this.pause,
          stop: this.stop,
        })}
      >
        {children}
      </Provider>
    );
  }

  private get currentAudio() {
    return this.state.audios[this.state.current];
  }

  private updateCurrentAudio(params: Partial<Audio>, callback?: () => void) {
    this.setState((state: ContextProps) => {
      if (!this.currentAudio) {
        return state;
      }

      return {
        audios: {
          ...this.state.audios,
          [this.state.current]: {
            ...this.currentAudio,
            ...params,
          },
        },
      };
    }, () => {
      if (this.currentAudio && callback) {
        callback();
      }
    });
  }

  private isReady(sound?: Sound) {
    return sound && sound.isLoaded() && !sound.isPlaying();
  }

  private play = (url: string) => {
    if (this.rejector) {
      this.rejector('Other audio is started.');
      this.rejector = undefined;
    }

    // 동일한 오디오 재생
    if (this.currentAudio && this.currentAudio.url === url) {
      return new Promise((resolve) => {
        if (this.currentAudio && this.isReady(this.currentAudio.sound)) {
          this.currentAudio.sound!.play(this.reset);
        }
        resolve(true);
      });
    }

    this.stop({ current: url });

    return new Promise((resolve, reject) => {
      this.rejector = reject;

      const sound = new Sound(url, '', (error) => {
        if (error) {
          return reject(error);
        }

        this.setState({
          audios: {
            ...this.state.audios,
            [url]: {
              url,
              sound,
              elapsedTime: 0,
              isPlaying: true,
            },
          },
        });
        sound.setVolume(1);
        sound.play(this.reset);
        this.setTimer();

        return resolve(true);
      });
    }).catch(() => {});
  }

  private stop = <K extends keyof ContextProps>(nextState?: Pick<ContextProps, K>) => {
    if (this.currentAudio && this.currentAudio.sound) {
      if (this.currentAudio.sound.isLoaded() && this.currentAudio.sound.isPlaying()) {
        this.currentAudio.sound.stop();
      }
      this.currentAudio.sound.release();
    }

    if (nextState) {
      this.setState(nextState);
    } else {
      this.setState({ current: '' });
    }
    this.clearTimer();
  }

  private pause = () => {
    if (!this.currentAudio || !this.currentAudio.sound) {
      return;
    }

    if (this.currentAudio.sound.isLoaded() && this.currentAudio.sound.isPlaying()) {
      this.currentAudio.sound.pause();
    }

    this.updateCurrentAudio({ isPlaying: false });
    this.clearTimer();
  }

  private replay = () => {
    if (!this.currentAudio || !this.currentAudio.sound) {
      return;
    }

    if (this.currentAudio.sound && this.currentAudio.sound.isLoaded()) {
      this.currentAudio.sound.stop(() => {
        this.updateCurrentAudio({ elapsedTime: 0 }, () => {
          this.currentAudio.sound!.play(this.reset);
        });
      });
    }
  }

  private reset = () => {
    if (!this.currentAudio || !this.currentAudio.sound) {
      return;
    }

    if (this.currentAudio.sound) {
      this.currentAudio.sound.stop();
      this.clearTimer();
      this.updateCurrentAudio({
        elapsedTime: 0,
        isPlaying: false,
      });
    }
  }

  private setTimer = () => {
    this.clearTimer();
    this.timer = setInterval(() => {
      if (this.currentAudio) {
        this.updateCurrentAudio({ elapsedTime: this.currentAudio.elapsedTime + 500 });
      }
    }, 500);
  }

  private clearTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}

export interface AudioActionProps {
  play: (url: string) => void;
  replay: () => void;
  pause: () => void;
  stop: () => void;
}

export interface AudioItemProps extends AudioActionProps {
  audio: Audio;
  isActivated: boolean;
}

export function withAudio<P>(WrappedComponent: React.ComponentType<P>, key?: string) {
  return (props: P) => (
    <Consumer>
      {({ current, audios, ...actions }) => (
        key ? (
          <WrappedComponent
            audio={audios[key]}
            isActivated={current === key}
            {...actions}
            {...props}
          />
        ) : (
          <WrappedComponent
            {...actions}
            {...props}
          />
        ))
      }
    </Consumer>
  );
}
