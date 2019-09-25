import {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  Alert,
  Animated,
  InteractionManager,
} from 'react-native';
import { RecordService } from 'services';
import { LocalizedStrings } from 'constants/translations';

function useRecord() {
  const recorderAnimation = useRef(new Animated.Value(0));
  const timer = useRef<number>();

  const [data, setData] = useState<{ path: string; duration: number }>();
  const [isRecorded, setIsRecorded] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const start = useCallback(() => {
    setIsStarted(true);
    if (isRecorded) {
      RecordService.play(() => setIsStarted(false));
    } else {
      InteractionManager.runAfterInteractions(() => {
        RecordService.start()
          .catch(e => Alert.alert(
            LocalizedStrings.COMMON_ERROR,
            LocalizedStrings.RECORD_FAILURE(e.message),
          ));
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
            recorderAnimation.current.stopAnimation();
            Animated.timing(recorderAnimation.current, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          })
          .catch((e) => Alert.alert(
            LocalizedStrings.COMMON_ERROR,
            LocalizedStrings.RECORD_FAILURE(e.message),
          ));
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
    recorderAnimation.current.stopAnimation();
    Animated.timing(recorderAnimation.current, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
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
  }, [isStarted, stop]);

  return {
    data,
    isRecorded,
    isStarted,
    toggle,
    release,
    recorderAnimation: recorderAnimation.current,
  };
}

export default useRecord;
