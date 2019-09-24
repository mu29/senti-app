import React, { useCallback } from 'react';
import uuidv4 from 'uuid/v4';
import firebase from 'react-native-firebase';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { RecordController } from 'components';
import { useRecord } from 'containers';
import { Alert } from 'react-native';
import {
  SHOW_MODAL,
  FETCH_PROFILE,
} from 'graphqls';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

interface Props {
  setIsLoading: (isLoading: boolean) => void;
  onCreate: ({
    url,
    duration,
  }: {
    url: string | null;
    duration: number;
  }) => Promise<void>;
  onFinish?: () => void;
}

const Container: React.FunctionComponent<Props> = ({
  setIsLoading,
  onCreate,
  onFinish,
}) => {
  const { data: profile } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    skip: !firebase.auth().currentUser,
    fetchPolicy: 'cache-only',
  });

  const [showAuthModal] = useMutation(SHOW_MODAL, {
    variables: { id: 'Auth' },
  });

  const {
    data,
    isStarted,
    isRecorded,
    toggle,
    release,
  } = useRecord();

  const upload = useCallback(async () => {
    if (!(profile && profile.me)) {
      throw new Error(LocalizedStrings.ERROR_AUTH_REQUIRED);
    }

    if (!isRecorded || !data) {
      throw new Error(LocalizedStrings.RECORD_UPLOAD_FAILURE_NOT_FOUND);
    }

    const id = uuidv4();
    const snapshot = await firebase.storage()
      .ref(`audios/${id}.aac`)
      .putFile(data.path);

    return {
      url: snapshot.downloadURL,
      duration: data.duration,
    };
  }, [data, isRecorded, profile]);

  const create = useCallback(() => {
    setIsLoading(true);
    upload()
      .then(onCreate)
      .then(() => setIsLoading(false))
      .then(release)
      .then(() => onFinish && onFinish())
      .catch((error) => {
        setIsLoading(false);
        if (error.message === LocalizedStrings.ERROR_AUTH_REQUIRED) {
          showAuthModal();
          AnalyticsService.logEvent('show_auth_modal_before_upload');
        } else {
          Alert.alert(LocalizedStrings.COMMON_ERROR, LocalizedStrings.RECORD_UPLOAD_FAILURE(error.message));
        }
      });
  }, [setIsLoading, upload, onCreate, release, onFinish, showAuthModal]);

  return (
    <RecordController
      isStarted={isStarted}
      isRecorded={isRecorded}
      toggle={toggle}
      release={release}
      create={create}
    />
  );
};

export default React.memo(Container);
