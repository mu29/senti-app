import {
  useState,
  useRef,
} from 'react';
import Sound from 'react-native-sound';

interface Audio {
  url: string;
  sound?: Sound;
  elapsedTime: number;
  isPlaying: boolean;
}

let timer: NodeJS.Timer;

function useAudio() {
  const current = useRef('');
  const [audios, setAudios] = useState<{ [key: string]: Audio }>({});
}
