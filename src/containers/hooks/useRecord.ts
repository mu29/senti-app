import {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { Alert } from 'react-native';
import { RecordService } from 'services';
import { LocalizedStrings } from 'constants/translations';

function useRecord() {
  const timer = useRef<number>();
  const [data, setData] = useState<{ path: string; duration: number }>();
  const [isRecorded, setIsRecorded] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const start = useCallback(() => {
    setIsStarted(true);
    if (isRecorded) {
      RecordService.play(() => setIsStarted(false));
    } else {
      RecordService.start()
        .catch(e => Alert.alert(
          LocalizedStrings.COMMON_ERROR,
          LocalizedStrings.RECORD_FAILURE(e.message),
        ));
    }
  }, [isRecorded]);

  const stop = useCallback(() => {
    if (isRecorded) {
      RecordService.pause();
    } else {
      setIsLoading(true);
      RecordService.stop()
        .then((result) => {
          setData(result);
          setIsRecorded(true);
        })
        .catch((e) => Alert.alert(
          LocalizedStrings.COMMON_ERROR,
          LocalizedStrings.RECORD_FAILURE(e.message),
        ))
        .finally(() => setIsLoading(false));
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

  useEffect(() => {
    if (isStarted && !isRecorded) {
      timer.current = setTimeout(() => {
        stop();
      }, 60 * 1000);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [isRecorded, isStarted, stop]);

  return {
    data,
    isRecorded,
    isStarted,
    isLoading,
    toggle,
    release,
  };
}

export default useRecord;
