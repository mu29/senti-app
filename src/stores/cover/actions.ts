import { runInAction } from 'mobx';
import firebase from 'react-native-firebase';
import { coverState } from 'stores/states';
import { LoadingType } from 'constants/enums';

export const updateCoverAction = (cover: string) => {
  coverState.current = cover;
};

export const shuffleCoverAction = () => {
  const { covers } = coverState;
  const index = Math.floor(Math.random() * coverState.covers.length);
  updateCoverAction(covers[index]);
};

export const readCoversAction = async () => {
  if (coverState.covers.length > 0) {
    return;
  }

  coverState.isLoading = LoadingType.LIST;

  const snapshot = await firebase.firestore().collection('extras').doc('covers').get();
  const covers = snapshot.get('urls') as string[];

  runInAction(() => {
    coverState.covers = covers;
    coverState.isLoading = LoadingType.NONE;
    shuffleCoverAction();
  });
};
