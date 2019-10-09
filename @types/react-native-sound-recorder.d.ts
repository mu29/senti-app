declare module 'react-native-sound-recorder' {
  function start(path: string, options?: Object): Promise<void>;
  function stop(): Promise<{ path: string, duration: number }>;
  function pause(): Promise<void>;
  function resume(): Promise<void>;

  const PATH_DOCUMENT: string;
  const PATH_CACHE: string;

  const SOURCE_CAMCORDER: string;
  const SOURCE_MIC: string;
  const SOURCE_REMOTE_SUBMIX: string;
  const SOURCE_VOICE_CALL: string;
  const SOURCE_VOICE_COMMUNICATION: string;
  const SOURCE_VOICE_DOWNLINK: string;
  const SOURCE_VOICE_RECOGNITION: string;
  const SOURCE_VOICE_UPLINK: string;

  const FORMAT_MPEG4AAC: string;
  const FORMAT_MPEG_4: string;

  const ENCODER_AAC: string;
}
