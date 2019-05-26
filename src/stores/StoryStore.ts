import {
  observable,
  action,
} from 'mobx';
import firebase from 'react-native-firebase';
import uuidv4 from 'uuid/v4';

class StoryStore {
  @observable
  public description = '';

  @action
  public updateDescription = (text: string) => {
    this.description = text;
  }

  public create = async (audioPath: string) => {
    const id = uuidv4();
    const snapshot = await firebase.storage()
      .ref(`audios/${id}.aac`)
      .putFile(audioPath);

    return {
      id,
      url: snapshot.downloadURL,
    };
  }
}

export default StoryStore;
