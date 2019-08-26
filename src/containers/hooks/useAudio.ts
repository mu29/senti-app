import {
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  AudioService,
  AudioState,
 } from 'services';

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

  const soundObserver = useCallback((state: AudioState) => {
    switch (state) {
      case AudioState.PLAY:
        setAudio((prev) => ({
          ...prev,
          isLoading: false,
          isActivated: true,
          isPlaying: true,
        }));
        break;
      case AudioState.PAUSE:
        setAudio((prev) => ({
          ...prev,
          isPlaying: false,
        }));
        break;
      case AudioState.STOP:
        setAudio((prev) => ({
          ...prev,
          elapsedTime: 0,
          isPlaying: false,
        }));
        break;
      case AudioState.LOADING:
        setAudio((prev) => ({
          ...prev,
          isLoading: true,
        }));
        break;
      case AudioState.ERROR:
        AudioService.play(key);
        break;
      case AudioState.NONE:
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
    AudioService.addObserver(key, soundObserver);

    return AudioService.removeObserver(key, soundObserver);
  }, []);

  return {
    audio,
    play: AudioService.play,
    pause: AudioService.pause,
    replay: AudioService.replay,
    release: AudioService.release,
  };
}

export default useAudio;
