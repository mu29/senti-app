import {
  useState,
  useCallback,
  useEffect,
} from 'react';
import SoundService, { SoundState } from './SoundService';

interface Audio {
  elapsedTime: number;
  isLoading: boolean;
  isActivated: boolean;
  isPlaying: boolean;
}

function useAudio(key: string) {
  const [audio, setAudio] = useState<Audio>({
    elapsedTime: 0,
    isLoading: false,
    isActivated: false,
    isPlaying: false,
  });

  const soundObserver = useCallback((state: SoundState) => {
    switch (state) {
      case SoundState.PLAY:
        setAudio((prev) => ({
          ...prev,
          isLoading: false,
          isActivated: true,
          isPlaying: true,
        }));
        break;
      case SoundState.PAUSE:
        setAudio((prev) => ({
          ...prev,
          isPlaying: false,
        }));
        break;
      case SoundState.STOP:
        setAudio((prev) => ({
          ...prev,
          elapsedTime: 0,
          isPlaying: false,
        }));
        break;
      case SoundState.LOADING:
        setAudio((prev) => ({
          ...prev,
          isLoading: true,
        }));
        break;
      case SoundState.ERROR:
        SoundService.play(key);
        break;
      case SoundState.NONE:
        setAudio({
          elapsedTime: 0,
          isLoading: false,
          isActivated: false,
          isPlaying: false,
        });
        break;
    }
  }, [key]);

  useEffect(() => {
    SoundService.addObserver(key, soundObserver);

    return SoundService.removeObserver(key, soundObserver);
  }, []);

  return {
    audio,
    play: SoundService.play,
    pause: SoundService.pause,
    replay: SoundService.replay,
    release: SoundService.release,
  };
}

export default useAudio;
