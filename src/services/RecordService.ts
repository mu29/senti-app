import SoundRecorder from 'react-native-sound-recorder';
import Sound from 'react-native-sound';

class RecordService {
  private sound?: Sound;

  public start = () => {
    this.release();
    return SoundRecorder.start(SoundRecorder.PATH_DOCUMENT + '/temp.aac');
  }

  public stop = async () => {
    const { path } = await SoundRecorder.stop();

    return new Promise((resolve, reject) => {
      this.sound = new Sound('temp.aac', path.replace('/temp.aac', ''), (error) => {
        error ? reject(error) : resolve();
      });
    });
  }

  public play = (onEnd: () => void) => {
    if (this.sound && this.sound.isLoaded() && !this.sound.isPlaying()) {
      this.sound.play(onEnd);
    }
  }

  public pause = () => {
    if (this.sound && this.sound.isLoaded() && this.sound.isPlaying()) {
      this.sound.stop();
    }
  }

  public release = () => {
    if (this.sound) {
      this.sound.release();
      this.sound = undefined;
    }
  }
}

export default new RecordService();
