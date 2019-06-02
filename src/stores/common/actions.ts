import uuidv4 from 'uuid/v4';
import firebase from 'react-native-firebase';

export async function uploadAudioAction(path: string) {
  const id = uuidv4();
  const snapshot = await firebase.storage()
    .ref(`audios/${id}.aac`)
    .putFile(path);

  return {
    id,
    url: snapshot.downloadURL,
  };
}
