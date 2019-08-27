import { useState, useCallback } from 'react';
import { RecordService } from 'services';

function useRecord() {
  const [data, setData] = useState<{ path: string; duration: number }>();
  const [isRecorded, setIsRecorded] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const toggle = useCallback(() => {
    if (isStarted) {
      if (isRecorded) {
        RecordService.pause();
      } else {
        RecordService.stop().then((result) => {
          setData(result);
          setIsRecorded(true);
        });
      }
      setIsStarted(false);
    } else {
      setIsStarted(true);
      if (isRecorded) {
        RecordService.play(RecordService.pause);
      } else {
        RecordService.start();
      }
    }
  }, [isStarted, isRecorded]);

  const release = useCallback(() => {
    RecordService.release();
    setIsRecorded(false);
  }, []);

  return {
    isRecorded,
    isStarted,
    toggle,
    release,
    data,
  };
}

export default useRecord;
