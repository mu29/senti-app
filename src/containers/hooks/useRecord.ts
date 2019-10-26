import {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  Alert,
  Linking,
} from 'react-native';
import { Toast } from 'components';
import { RecordService } from 'services';
import { LocalizedStrings } from 'constants/translations';

function useRecord() {
  const timer = useRef<number>();
  const [data, setData] = useState<{ path: string; duration: number }>();
  const [isRecorded, setIsRecorded] = useState(false);
  const [startAt, setStartAt] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const start = useCallback(() => {
    if (isRecorded) {
      setStartAt(Date.now());
      RecordService.play(() => setStartAt(0));
    } else {
      RecordService.start()
        .then(() => setStartAt(Date.now()))
        .catch(e => Alert.alert(
          LocalizedStrings.COMMON_ERROR,
          LocalizedStrings.RECORD_FAILURE(e.message),
        ));
    }
  }, [isRecorded, setStartAt]);

  const stop = useCallback(() => {
    if (isRecorded) {
      RecordService.pause();
    } else {
      if (Date.now() - startAt < 3000) {
        Toast.show(LocalizedStrings.RECORD_FAILURE_TOO_SHORT);
        return;
      }

      setIsLoading(true);
      RecordService.stop()
        .then((result) => {
          if (result.duration === 0) {
            Alert.alert(
              LocalizedStrings.COMMON_ERROR,
              LocalizedStrings.RECORD_FAILURE_REQUEST_PERMISSION,
              [{
                text: LocalizedStrings.COMMON_CONFIRM,
                onPress: () => Linking.openSettings(),
              }, {
                text: LocalizedStrings.COMMON_CANCEL,
                style: 'cancel',
              }],
            );
            return;
          }

          setData(result);
          setIsRecorded(true);
        })
        .catch((e) => Alert.alert(
          LocalizedStrings.COMMON_ERROR,
          LocalizedStrings.RECORD_FAILURE(e.message),
        ))
        .finally(() => setIsLoading(false));
    }
    setStartAt(0);
  }, [isRecorded, startAt, setStartAt]);

  const toggle = useCallback(() => {
    if (startAt > 0) {
      stop();
    } else {
      start();
    }
  }, [start, stop, startAt]);

  const release = useCallback(() => {
    RecordService.release();
    setIsRecorded(false);
  }, []);

  useEffect(() => {
    if (startAt > 0 && !isRecorded) {
      timer.current = setTimeout(() => {
        stop();
      }, 60 * 1000);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [isRecorded, startAt, stop]);

  return {
    data,
    isRecorded,
    isStarted: startAt > 0,
    isLoading,
    toggle,
    release,
  };
}

export default useRecord;
