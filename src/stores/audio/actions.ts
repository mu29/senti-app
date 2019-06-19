import { runInAction } from 'mobx';
import mergeWith from 'lodash/mergeWith';
import Sound from 'react-native-sound';
import { LoadingType } from 'constants/enums';
import { audioState } from './state';

export function playAudioAction(data: Audio) {
  if (audioState.isLoading !== LoadingType.NONE) {
    return Promise.resolve(false);
  }

  const audio = audioState.audios[data.id];

  // 동일한 오디오 재생
  if (audio && audio.id === audioState.current) {
    if (audio.sound && audio.sound.isLoaded() && !audio.sound.isPlaying()) {
      return new Promise((resolve) => {
        audio.sound!.play(resetAudioAction);
        Object.assign(audio, { isPlaying: true });
        setTimer();
        resolve(true);
      });
    }
  }

  runInAction(() => {
    audioState.isLoading = LoadingType.READ;
    audioState.candidate = data.id;
    stopAudioAction();
  });

  return new Promise((resolve, reject) => {
    const sound = new Sound(data.url, '', (error) => {
      if (error) {
        return reject(error);
      }

      if (audioState.candidate !== data.id) {
        return resolve(false);
      }

      runInAction(() => {
        audioState.current = data.id;
        audioState.isLoading = LoadingType.NONE;
        mergeWith(audioState.audios, {
          [data.id]: {
            ...data,
            sound,
            currentTime: 0,
            isActivated: true,
            isPlaying: true,
          },
        });
        setTimer();
      });

      sound.setVolume(1);
      sound.play(resetAudioAction);

      return resolve(true);
    });
  });
}

export function stopAudioAction() {
  if (!audioState.current) {
    return;
  }

  const audio = audioState.audios[audioState.current];

  if (!audio.sound) {
    return;
  }

  if (audio.sound.isLoaded() && audio.sound.isPlaying()) {
    audio.sound.stop();
  }
  audio.sound.release();

  clearTimer();
  Object.assign(audio, {
    currentTime: 0,
    isActivated: false,
    isPlaying: false,
  });
  audioState.current = undefined;
}

export function pauseAudioAction() {
  if (!audioState.current) {
    return;
  }

  const audio = audioState.audios[audioState.current];

  if (!audio.sound) {
    return;
  }

  if (audio.sound.isLoaded() && audio.sound.isPlaying()) {
    audio.sound.pause();
  }

  clearTimer();
  Object.assign(audio, { isPlaying: false });
}

export function replayAudioAction() {
  if (!audioState.current) {
    return;
  }

  const audio = audioState.audios[audioState.current];

  if (!audio.sound) {
    return;
  }

  if (audio.sound.isLoaded()) {
    audio.sound.stop(() => {
      Object.assign(audio, {
        currentTime: 0,
        isPlaying: true,
      });
      audio.sound!.play(resetAudioAction);
    });
  }
}

export function resetAudioAction() {
  if (!audioState.current) {
    return;
  }

  const audio = audioState.audios[audioState.current];

  if (!audio.sound) {
    return;
  }

  audio.sound.stop();
  clearTimer();
  Object.assign(audio, {
    currentTime: 0,
    isPlaying: false,
  });
}

function setTimer() {
  clearTimer();
  audioState.timer = setInterval(() => {
    if (audioState.current) {
      audioState.audios[audioState.current].currentTime += 500;
    }
  }, 500);
}

function clearTimer() {
  if (audioState.timer) {
    clearInterval(audioState.timer);
    audioState.timer = undefined;
  }
}
