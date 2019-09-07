import {
  useState,
  useCallback,
} from 'react';
import {
  Alert,
  InteractionManager,
} from 'react-native';
import { RecordService } from 'services';

function useRecord() {
  const [data, setData] = useState<{ path: string; duration: number }>();
  const [isRecorded, setIsRecorded] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const start = useCallback(() => {
    setIsStarted(true);
    if (isRecorded) {
      RecordService.play(() => setIsStarted(false));
    } else {
      requestAnimationFrame(() => {
        RecordService.start();
      });
    }
  }, [isRecorded]);

  const stop = useCallback(() => {
    if (isRecorded) {
      RecordService.pause();
    } else {
      InteractionManager.runAfterInteractions(() => {
        RecordService.stop()
          .then((result) => {
            setData(result);
            setIsRecorded(true);
          })
          .catch(() => Alert.alert('알림', '녹음에 실패했습니다. 다시 시도해 주세요.'));
      });
    }
    setIsStarted(false);
  }, [isRecorded]);

  const toggle = useCallback(() => {
    if (isStarted) {
      stop();
    } else {
      start();
    }
  }, [start, stop, isStarted]);

  const release = useCallback(() => {
    RecordService.release();
    setIsRecorded(false);
  }, []);

  return {
    data,
    isRecorded,
    isStarted,
    toggle,
    release,
  };
}

export default useRecord;
