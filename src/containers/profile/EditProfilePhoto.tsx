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

const Container: React.FunctionComponent<{}> = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    skip: !firebase.auth().currentUser,
    fetchPolicy: 'cache-only',
  });

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    update: (cache, { data: { updateProfile: newProfile } }) => {
      const savedProfile = cache.readQuery<{ me: Profile }>({ query: FETCH_PROFILE });

      if (!savedProfile) {
        return;
      }

      cache.writeQuery({
        query: FETCH_PROFILE,
        data: {
          me: {
            ...savedProfile.me,
            ...newProfile,
          },
        },
      });
    },
  });

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
      .catch(e => Alert.alert('알림', `프로필 사진 변경 실패했습니다.\n${e.message}`))
      .finally(() => setIsLoading(false));
  }, []);

  if (!data || !data.me) {
    return null;
  }

  return (
    <EditProfilePhoto
      photoUrl={data.me.photoUrl}
      isLoading={isLoading}
      updateProfilePhoto={updateProfilePhoto}
    />
  );
};

export default React.memo(Container);
