import SoundRecorder from 'react-native-sound-recorder';
import Sound from 'react-native-sound';
import { recordState } from 'stores/states';

export function resetRecordAction() {
  if (recordState.data) {
    recordState.data.audio.release();
    recordState.data = undefined;
  }
}

export function startRecordAction() {
  return SoundRecorder.start(SoundRecorder.PATH_DOCUMENT + '/temp.aac');
}

export async function stopRecordAction() {
  const {
    path,
    duration,
  } = await SoundRecorder.stop();

  return new Promise((resolve, reject) => {
    const audio = new Sound('temp.aac', path.replace('/temp.aac', ''), (error) => {
      if (error) {
        reject(error);
        return;
      }

      recordState.data = {
        audio,
        path,
        duration,
      };
      resolve();
    });
  });
}

export function startPlayRecordAction(onEnd: () => void) {
  if (!recordState.data) {
    return;
  }

  const { audio } = recordState.data;

  if (audio.isLoaded() && !audio.isPlaying()) {
    audio.play(onEnd);
  }
}

export function stopPlayRecordAction() {
  if (!recordState.data) {
    return;
  }

  const { audio } = recordState.data;

  if (audio.isLoaded() && audio.isPlaying()) {
    audio.stop();
  }
}
