import React, {
  useState,
  useCallback,
} from 'react';
import { Alert } from 'react-native';
import uuidv4 from 'uuid/v4';
import firebase from 'react-native-firebase';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { EditProfilePhoto } from 'components';
import {
  FETCH_PROFILE,
  UPDATE_PROFILE,
} from 'graphqls';
import { LocalizedStrings } from 'constants/translations';

const Container: React.FunctionComponent<{}> = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: {
      profile,
    } = {
      profile: undefined,
    },
  } = useQuery<{ profile: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const updateProfilePhoto = useCallback((path: string) => {
    const id = uuidv4();
    const extension = path.split('.').reverse()[0];
    const filePath = `profiles/${id}.${extension}`;

    setIsLoading(true);

    firebase.storage()
      .ref(filePath)
      .putFile(path)
      .then(snapshot => updateProfile({
        variables: {
          input: {
            photoUrl: snapshot.downloadURL,
          },
        },
      }))
      .catch(e => Alert.alert(
        LocalizedStrings.COMMON_ERROR,
        LocalizedStrings.PROFILE_PHOTO_CHANGE_FAILURE(e.message),
      ))
      .finally(() => setIsLoading(false));
  }, [updateProfile]);

  if (!profile) {
    return null;
  }

  return (
    <EditProfilePhoto
      photoUrl={profile.photoUrl}
      isLoading={isLoading}
      updateProfilePhoto={updateProfilePhoto}
    />
  );
};

export default React.memo(Container);
