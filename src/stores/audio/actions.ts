import { runInAction } from 'mobx';
import Sound from 'react-native-sound';
import { LoadingType } from 'constants/enums';
import { audioState } from './state';

export function playAudioAction(path: string) {
  if (audioState.isLoading !== LoadingType.NONE) {
    return Promise.resolve(false);
  }

  // 동일한 오디오 재생
  if (audioState.current) {
    const {
      audio: currentAudio,
      path: currentPath,
    } = audioState.current;
    if (path === currentPath && currentAudio.isLoaded() && !currentAudio.isPlaying()) {
      return new Promise((resolve) => {
        currentAudio.play(resetAudioAction);
        setTimer();
        resolve(true);
      });
    }
  }

  runInAction(() => {
    audioState.isLoading = LoadingType.READ;
    stopAudioAction();
  });

  return new Promise((resolve, reject) => {
    const audio = new Sound(path, '', (error) => {
      if (error) {
        reject(error);
        return;
      }

      runInAction(() => {
        audioState.current = {
          audio,
          path,
          duration: 0,
        };
        audioState.isLoading = LoadingType.NONE;
        setTimer();
      });

      audio.setVolume(1);
      audio.play(resetAudioAction);

      resolve(true);
    });
  });
}

export function stopAudioAction() {
  if (!audioState.current) {
    return;
  }

  const { audio } = audioState.current;

  if (audio.isLoaded() && audio.isPlaying()) {
    audio.stop();
  }
  audio.release();

  audioState.current = undefined;
  clearTimer();
}

export function pauseAudioAction() {
  if (!audioState.current) {
    return;
  }

  const { audio } = audioState.current;

  if (audio.isLoaded() && audio.isPlaying()) {
    audio.pause();
  }

  clearTimer();
}

export function replayAudioAction() {
  if (!audioState.current) {
    return;
  }

  const { audio } = audioState.current;

  if (audio.isLoaded()) {
    audio.stop(() => {
      audioState.duration = 0;
      audio.play();
    });
  }
}

export function resetAudioAction() {
  if (!audioState.current) {
    return;
  }

  audioState.current.audio.stop();
  runInAction(() => {
    audioState.current!.duration = 0;
    clearTimer();
  });
}

function setTimer() {
  clearTimer();
  audioState.timer = setInterval(() => {
    if (audioState.current) {
      audioState.current.duration += 500;
    }
  }, 500);
}

function clearTimer() {
  if (audioState.timer) {
    clearInterval(audioState.timer);
    audioState.timer = undefined;
  }
}
