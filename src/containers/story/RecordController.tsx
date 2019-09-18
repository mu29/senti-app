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
      throw new Error('로그인 후 이용해주세요.');
    }

    if (!isRecorded || !data) {
      throw new Error('녹음 파일이 없습니다.');
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
        if (error.message === '로그인 후 이용해주세요.') {
          showAuthModal();
          AnalyticsService.logEvent('show_auth_modal_before_upload');
        } else {
          Alert.alert('알림', `녹음 파일 업로드에 실패했습니다.\n${error.message}`);
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
