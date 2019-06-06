import { runInAction } from 'mobx';
import Sound from 'react-native-sound';
import { LoadingType } from 'constants/enums';
import { audioState } from './state';

export function playAudioAction(path: string) {
  if (audioState.isLoading !== LoadingType.NONE) {
    return Promise.resolve(false);
  }

  // 동일한 오디오 재생
  const { audio: currentAudio } = audioState;
  if (
    currentAudio
    && path === audioState.path
    && currentAudio.isLoaded()
    && !currentAudio.isPlaying()
  ) {
    return new Promise((resolve) => {
      currentAudio.play(resetAudioAction);
      setTimer();
      resolve(true);
    });
  }

  runInAction(() => {
    audioState.isLoading = LoadingType.READ;
    stopAudioAction();
    audioState.path = path;
  });

  return new Promise((resolve, reject) => {
    const audio = new Sound(path, '', (error) => {
      if (error) {
        reject(error);
        return;
      }

      runInAction(() => {
        audioState.audio = audio;
        audioState.duration = 0;
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
  const { audio } = audioState;

  if (!audio) {
    return;
  }

  if (audio.isLoaded() && audio.isPlaying()) {
    audio.stop();
  }
  audio.release();

  audioState.audio = undefined;
  audioState.path = undefined;
  audioState.duration = 0;
  clearTimer();
}

export function pauseAudioAction() {
  const { audio } = audioState;

  if (!audio) {
    return;
  }

  if (audio.isLoaded() && audio.isPlaying()) {
    audio.pause();
  }

  clearTimer();
}

export function replayAudioAction() {
  const { audio } = audioState;

  if (!audio) {
    return;
  }

  if (audio.isLoaded()) {
    audio.stop(() => {
      audioState.duration = 0;
      audio.play();
    });
  }
}

export function resetAudioAction() {
  const { audio } = audioState;

  if (!audio) {
    return;
  }

  audio.stop();
  runInAction(() => {
    audioState.duration = 0;
    clearTimer();
  });
}

function setTimer() {
  clearTimer();
  audioState.timer = setInterval(() => {
    audioState.duration += 1000;
  }, 1000);
}

function clearTimer() {
  if (audioState.timer) {
    clearInterval(audioState.timer);
    audioState.timer = undefined;
  }
}
