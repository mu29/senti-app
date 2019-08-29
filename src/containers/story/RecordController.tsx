import React, {
  useState,
  useCallback,
} from 'react';
import uuidv4 from 'uuid/v4';
import firebase from 'react-native-firebase';
import { RecordController } from 'components';
import { useRecord } from 'containers';
import { Alert } from 'react-native';

interface Props {
  onCreate: ({
    url,
    duration,
  }: {
    url: string | null;
    duration: number;
  }) => Promise<void>;
  onFinish?: () => void;
}

const RecordControllerContainer: React.FunctionComponent<Props> = ({
  onCreate,
  onFinish,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    data,
    isStarted,
    isRecorded,
    toggle,
    release,
  } = useRecord();

  const upload = useCallback(async () => {
    if (!isRecorded || !data) {
      return Promise.reject();
    }

    const id = uuidv4();
    const snapshot = await firebase.storage()
      .ref(`audios/${id}.aac`)
      .putFile(data.path);

    return {
      url: snapshot.downloadURL,
      duration: data.duration,
    };
  }, [data, isRecorded]);

  const create = useCallback(() => {
    setIsLoading(true);
    upload()
      .then(onCreate)
      .then(() => setIsLoading(false))
      .then(() => onFinish && onFinish())
      .catch((error) => {
        Alert.alert('알림', `녹음 파일 업로드에 실패했습니다.\n${error.message}`);
      });
  }, [upload, onCreate]);

  return (
    <RecordController
      isLoading={isLoading}
      isStarted={isStarted}
      isRecorded={isRecorded}
      toggle={toggle}
      release={release}
      create={create}
    />
  );
};

export default React.memo(RecordControllerContainer);
