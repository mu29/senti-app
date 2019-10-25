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
  beforeUpload?: () => Promise<boolean>;
  afterUpload: ({
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
  beforeUpload,
  afterUpload,
  onFinish,
}) => {
  const {
    data: {
      profile,
    } = {
      profile: undefined,
    },
  } = useQuery<{ profile: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const [showAuthModal] = useMutation(SHOW_MODAL, {
    variables: { id: 'Auth' },
  });

  const {
    data,
    isRecorded,
    isStarted,
    isLoading,
    toggle,
    release,
  } = useRecord();

  const upload = useCallback(async () => {
    if (!profile) {
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

  const create = useCallback(async () => {
    if (beforeUpload && !await beforeUpload()) {
      return;
    }

    setIsLoading(true);
    upload()
      .then(afterUpload)
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
  }, [setIsLoading, upload, beforeUpload, afterUpload, release, onFinish, showAuthModal]);

  return (
    <RecordController
      isRecorded={isRecorded}
      isStarted={isStarted}
      isLoading={isLoading}
      toggle={toggle}
      release={release}
      create={create}
    />
  );
};

export default React.memo(Container);
